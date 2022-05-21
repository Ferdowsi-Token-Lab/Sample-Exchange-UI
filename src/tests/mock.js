
const COINS = [
    { key: 1, name: 'name1', coinicon: 'icon1', proposals: [{ volume: 1000, ratio: 1.00, targetcoin: 'coin2' }] },
    {
        key: 2,
        name: 'name2', coinicon: 'icon2', proposals: [
            { key: 1, volume: 1000, ratio: 1.00, targetcoin: 'coin3' },
            { key: 2, volume: 2000, ratio: 2.00, targetcoin: 'coin4' },

        ]
    },
];

export { COINS }