class MetaMask {
    constructor(_tokens) {
        /*
        _tokens is expected to be an array of objects with name,symbol,type and address property.
        */
        this.tokens = _tokens;
    }
    async setupConnections() {
        let provider;
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            provider = new ethers.providers.Web3Provider(window.ethereum); // TODO: use metamask-react
            await provider.send("eth_requestAccounts", []);

        } else {
            // we are probably in hardhat console 
            provider = await hre.ethers.provider;
        }
        const signer = await provider.getSigner();
        this.signer = signer;
        const _erc20ABI = [
            "function name() view returns (string)",
            "function symbol() view returns (string)",
            "function balanceOf(address) view returns (uint)",
            "function transfer(address to, uint amount)",
            "function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)",
            "function approve(address _spender, uint256 _value) public returns (bool success)",
            "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
            "event Approval(address indexed _owner, address indexed _spender, uint256 _value)",
            "event Transfer(address indexed from, address indexed to, uint amount)",

        ];
        const _exchangerABI = [
            "event proposed(uint indexed id, address indexed asset1, uint amount1, address indexed asset2, uint amount2)",
            "event canceled(uint indexed id)",
            "event accepted(uint indexed id)",
            "function propose(address asset1, uint amount1, address asset2, uint amount2) returns (uint)",
            "function accept(uint id)",
            "function cancel(uint id)",
            "function getStatus(uint256 id) external view returns (string)",
        ];

        this.tokens.forEach((token) => {
            let _abi;
            if (token.type == "erc20") {
                _abi = _erc20ABI;
            } else if (token.type == "exchanger") {
                _abi = _exchangerABI;
            } else {
                throw new Error("Unknown contract type");
            }
            const _instance = new ethers.Contract(token.address, _abi, signer);
            token.instance = _instance;
        });
    }
    _erc20Filter(token) {
        if (token.type == "erc20") {
            return true;
        } else {
            return false;
        }
    }
    _exchangerFilter(token) {
        if (token.type == "exchanger") {
            return true;
        } else {
            return false;
        }

    }
    async getProposals() {
        let [exchanger] = this.tokens.filter(this._exchangerFilter);
        let p = await exchanger.instance.queryFilter(exchanger.instance.filters.proposed());
        return p;
    }
    async getProposalStatus(id) {
        let [exchanger] = this.tokens.filter(this._exchangerFilter);
        let status = exchanger.instance.getStatus(id);
        return status;
    }
    async getCoins() {
        let _exchangetokens = this.tokens.filter(this._erc20Filter);
        let _coins = [];
        for (const token of _exchangetokens) {
            let coin = {};
            coin.name = token.name;
            coin.symbol = token.symbol;
            coin.key = token.address;
            let _proposals = await this.getProposals();
            let _tp = _proposals.filter((prp) => {
                if (prp.args.asset1 == token.address) {
                    return true;
                } else {
                    return false;
                }
            });
            coin.proposals = [];
            for (const p of _tp) {
                let _proposal = {};
                _proposal.volume = p.args.amount1.toNumber();
                _proposal.ratio = p.args.amount1 / p.args.amount2;
                _proposal.targetCoin = p.args.asset2;
                _proposal.key = p.args.id;
                _proposal.status = await this.getProposalStatus(p.args.id);
                coin.proposals.push(_proposal);

            }
            _coins.push(coin);

        }
        return _coins;

    }
    getToken(tokenAddress) {
        return this.tokens.filter((token) => {
            if (token.address == tokenAddress) {
                return true;
            } else {
                return false;
            }
        })[0];
    }
    getExchanger() {
        let ex = this.tokens.filter(this._exchangerFilter);
        return ex[0];
    }
    async propose(fromToken, toToken, amount, ratio) {
        console.log(fromToken, toToken, amount, ratio)
        const et = this.getExchanger();
        await et.instance.propose(fromToken, amount, toToken, parseInt(amount / ratio));
    }
    async cancel(id) {
        const et = this.getExchanger();
        await et.instance.cancel(id);
    }
    async accept(id) {
        const et = this.getExchanger();
        await et.instance.accept(id);
    }
    async approve(fromToken, amount) {
        const ft = fromToken.instance;
        const et = this.getExchanger();
        await ft.approve(et.address, amount);
    }
    getTokens() {
        let erc20tokens = this.tokens.filter(this._erc20Filter);
        let exchanger = this.tokens.filter(this._exchangerFilter);
        for (let token of erc20tokens) {
            token.allowance = token.instance.allowance(this.signer.address, exchanger[0].instance.address);
        }
        for (let token of erc20tokens) {
            token.balance = token.instance.balanceOf(this.signer.address);
        }
        return erc20tokens;
    }


}

(async () => {
    tokens = await (await fetch('Tokens.json')).json()
    window.metamask = new MetaMask(tokens);
    window.metamask.setupConnections();
})()
