// import { ethers } from "ethers";

class MetaMask {
    constructor(_tokens) {
        /*
        _tokens is expected to be an array of objects with name,symbol,type and address property.
        */
        this.tokens = _tokens;
    }
    async setupConnections() {
        let provider;
        if(typeof window !== "undefined" && typeof window.ethereum !== "undefined"){
            provider = new ethers.providers.Web3Provider(window.ethereum); // TODO: use metamask-react
            await provider.send("eth_requestAccounts", []);

        }else{
            // we are probably in hardhat console 
            provider = await hre.ethers.provider;
        }
        const signer = await provider.getSigner();
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
    async getCoins() {
        let _exchangetokens = this.tokens.filter(this._erc20Filter);
        let _coins = [];
        let key = 0;
        for(const token of _exchangetokens){
            let coin = {};
            coin.name = token.name;
            coin.symbol = token.symbol;
            coin.key = key++;
            let _proposals = await this.getProposals();
            let _tp = _proposals.filter((prp) => {
                if (prp.args.asset1 == token.address) {
                    return true;
                } else {
                    return false;
                }
            });
            let _pk = 0;
            coin.proposals = [];
            _tp.forEach((p) => {
                let _proposal = {};
                _proposal.volume = p.args.amount1.toNumber();
                _proposal.ratio = p.args.amount1 / p.args.amount2;
                _proposal.targetCoin = p.args.asset2;
                _proposal.key = _pk++;
                coin.proposals.push(_proposal);
            });
            _coins.push(coin);

        }
        return _coins;

    }
    // getCoinInfo(tokenAddress){

    // }
}