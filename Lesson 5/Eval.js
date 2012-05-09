var lookup = function (env, v) {
    while (env.hasOwnProperty('bindings')) {
        if (env.bindings.hasOwnProperty(v))
            return env.bindings[v];
        env = env.outer;
    }
}

var functions = {
    '+': function (args, env) {
        if (args.length < 2)
            throw '+: expected 2 or more parameters but received ' + args.length;
        var r = args[0];
        if (typeof r != 'number')
            throw '+: numerical parameters required';
        for (var i = 1; i < args.length; i++) {
            if (typeof args[i] != 'number')
                throw '+: numerical parameters required';
            r += args[i];
        }
        return r;
    },
    '-': function (args, env) {
        if (args.length < 1)
            throw '-: expected 1 or more parameters but received ' + args.length;
        var r = args[0];
        if (typeof r != 'number')
            throw '-: numerical parameters required';
        if (args.length === 1)
            return -r;
        for (var i = 1; i < args.length; i++) {
            if (typeof args[i] != 'number')
                throw '-: numerical parameters required';
            r -= args[i];
        }
        return r;
    },
    '*': function (args, env) {
        if (args.length < 2)
            throw '+: expected 2 or more parameters but received ' + args.length;
        var r = args[0];
        if (typeof r != 'number')
            throw '+: numerical parameters required';
        for (var i = 1; i < args.length; i++) {
            if (typeof args[i] != 'number')
                throw '+: numerical parameters required';
            r *= args[i];
        }
        return r;
    },
    '/': function (args, env) {
        if (args.length < 2)
            throw '/: expected 2 or more parameters but received ' + args.length;
        var r = args[0];
        if (typeof r != 'number')
            throw '/: numerical parameters required';
        for (var i = 1; i < args.length; i++) {
            if (typeof args[i] != 'number')
                throw '/: numerical parameters required';
            r /= args[i];
        }
        return r;
    },
    '=': function (args, env) {
        if (args.length < 2)
            throw '=: expected 2 or more parameters but received ' + args.length;
        var r = args[0];
        for (var i = 1; i < args.length; i++)
            if (r != args[i])
                return '#f';
        return '#t';
    },
    '<': function (args, env) {
        if (args.length < 2)
            throw '<: expected 2 or more parameters but received ' + args.length;
        var r = args[0];
        for (var i = 1; i < args.length; i++) {
            if (r >= args[i])
                return '#f';
            r = args[i];
        }
        return '#t';
    },
    '>': function (args, env) {
        if (args.length < 2)
            throw '>: expected 2 or more parameters but received ' + args.length;
        var r = args[0];
        for (var i = 1; i < args.length; i++) {
            if (r <= args[i])
                return '#f';
            r = args[i];
        }
        return '#t';
    },
    '<=': function (args, env) {
        if (args.length < 2)
            throw '<=: expected 2 or more parameters but received ' + args.length;
        var r = args[0];
        for (var i = 1; i < args.length; i++) {
            if (r > args[i])
                return '#f';
            r = args[i];
        }
        return '#t';
    },
    '>=': function (args, env) {
        if (args.length < 2)
            throw '>=: expected 2 or more parameters but received ' + args.length;
        var r = args[0];
        for (var i = 1; i < args.length; i++) {
            if (r < args[i])
                return '#f';
            r = args[i];
        }
        return '#t';
    },
    'cons': function (args, env) {
        if (args.length != 2)
            throw 'cons: expected 2 parameters but received ' + args.length;
        return [args[0]].concat(args[1]);
    },
    'car': function (args, env) {
        if (args.length != 1)
            throw 'car: expected 1 parameter but received ' + args.length;
        if (args[0].length === 0)
            throw 'car: empty array';
        return args[0][0];
    },
    'cdr': function (args, env) {
        if (args.length != 1)
            throw 'cdr: expected 1 parameter but received ' + args.length;
        var r = args[0];
        if (r.length === 0)
            throw 'cdr: empty array';
        r.splice(0,1);
        return r;
    },
    'begin': function (args, env) {
        return args[args.length - 1];
    },
    'let-one': function (args, env) { //wip
        if (args.length != 3)
            throw 'let-one: expected 3 parameters but received ' + args.length;
        var newenv = {bindings: {}, outer: env};
        newenv.bindings[args[0]] = args[1];
        return evalScheem(args[2], newenv);
    },
    'let': function (args, env) { //wip
        if (args.length != 3)
            throw 'let: expected 2 parameters but received ' + args.length;
        var newenv = {bindings: {}, outer: env};
        for (var i = 0; i < args[0].length; i++) {
            t = args[0][i];
            if (typeof t != 'string' || t.length != 2)
                throw 'lambda: invalid binding';
            newenv.bindings[t[0]] = evalScheem(t[1], env);
        }
        return evalScheem(args[1], newenv);
    },
    'alert': function (args, env) {
        if (args.length != 1)
            throw 'alert: expected 1 parameter but received ' + args.length;
        alert(args[0]);
        return args[0];
    }
};

var evalScheem = function (expr, env) {
    if (!env)
        env = {bindings: {}, outer: {bindings: functions, outer: {}}};
    if (typeof expr === 'number')
        return expr;
    if (typeof expr === 'string') {
        var r = lookup(env, expr);
        if (typeof r === 'undefined')
            throw 'undefined symbol: ' + expr;
        return r;
    }
    switch (expr[0]) {
        case 'define':
            if (expr.length != 3)
                throw 'define: expected 2 parameters but received ' + (expr.length - 1);
            if (typeof env.bindings[expr[1]] != 'undefined')
                throw 'symbol already defined: ' + expr[1];
            var r = evalScheem(expr[2], env);
            env.bindings[expr[1]] = r;
            return r;
        case 'set!':
            if (expr.length != 3)
                throw 'set!: expected 2 parameters but received ' + (expr.length - 1);
            while (env.hasOwnProperty('bindings')) {
                if (env.bindings.hasOwnProperty(expr[1])) {
                    var r = evalScheem(expr[2], env)
                    env.bindings[expr[1]] = r;
                    return r;
                }
                env = env.outer;
            }
            throw 'set!: undefined symbol: ' + expr[1];
        case 'quote':
            if (expr.length != 2)
                throw 'quote: expected 1 parameter but received ' + (expr.length - 1);
            return expr[1];
        case 'if':
            if (expr.length != 3 && expr.length != 4)
                throw 'if: expected 2 or 3 parameters but received ' + (expr.length - 1);
            if (evalScheem(expr[1], env) === '#t')
                return evalScheem(expr[2]);
            if (typeof expr[3] === 'undefined')
                return 0;
            return evalScheem(expr[3]);
        case 'lambda':
            if (expr.length != 3)
                throw 'lambda: expected 2 parameters but received ' + (expr.length - 1);
            return function (args) {
                var newenv = {bindings: {}, outer: env};
                for (var i = 0; i < args.length; i++)
                    newenv.bindings[expr[1][i]] = args[i];
                return evalScheem(expr[2], newenv);
            };
        default:
            var r = evalScheem(expr[0], env);
            var t = []
            for (var i = 1; i < expr.length; i++)
                t.push(evalScheem(expr[i], env));
            return r(t, env);
    }
};