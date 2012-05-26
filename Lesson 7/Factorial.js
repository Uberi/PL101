var thunk = function (f, lst) {
    return { tag: "thunk", func: f, args: lst };
};

var thunkValue = function (x) {
    return { tag: "value", val: x };
};

var trampoline = function (thk) {
    while (true) {
        if (thk.tag === "value") {
            return thk.val;
        }
        if (thk.tag === "thunk") {
            thk = thk.func.apply(null, thk.args);
        }
    }
};

var sumFactorial = function (n, cont) {
    if (n <= 1) return thunk(cont, [1]);
    else {
        var new_cont = function (v) {
            return thunk(cont, [v * n]);
        };
        return thunk(sumThunk, [n - 1, new_cont]);
    }
};

var bigFactorial = function (n) {
    return trampoline(factorialThunk(n, thunkValue));
};