class TailLib {

    static numberToString = (num) => num === 0 ? 'head': 'tail';

    static stringToNumber = (str) => str === 'head' ? 0 : 1;

    static pickReverse = (num) => num === 0 ? 1 : 0;

    static coinFlip = () => Math.round(Math.random());
}

module.exports = {TailLib};