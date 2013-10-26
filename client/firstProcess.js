FirstProcess = {
    computeA: function (input) {
        return input * 2;
    },
    computeB: function (input) {
        if (typeof input !== "number") {
            throw "Input incorrect";
        }
        return input * 3;
    }
};
