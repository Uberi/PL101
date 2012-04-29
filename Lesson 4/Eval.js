var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Strings are variable references
    if (typeof expr === 'string') {
        return env[expr];
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case '+':
            if (expr.length < 3)
                throw '+: expected 2 or more parameters but received ' + (expr.length - 1);
            var r = evalScheem(expr[1], env);
            for (var i = 2; i < expr.length; i++)
                r += evalScheem(expr[i], env);
            return r;
        case '-':
            if (expr.length < 3)
                throw '-: expected 2 or more parameters but received ' + (expr.length - 1);
            var r = evalScheem(expr[1], env);
            for (var i = 2; i < expr.length; i++)
                r -= evalScheem(expr[i], env);
            return r;
        case '*':
            if (expr.length < 3)
                throw '*: expected 2 or more parameters but received ' + (expr.length - 1);
            var r = evalScheem(expr[1], env);
            for (var i = 2; i < expr.length; i++)
                r *= evalScheem(expr[i], env);
            return r;
        case '/':
            if (expr.length < 3)
                throw '/: expected 2 or more parameters but received ' + (expr.length - 1);
            var r = evalScheem(expr[1], env);
            for (var i = 2; i < expr.length; i++)
                r /= evalScheem(expr[i], env);
            return r;
        case '=':
            if (expr.length < 3)
                throw '=: expected 2 or more parameters but received ' + (expr.length - 1);
            var r = evalScheem(expr[1], env);
            for (var i = 2; i < expr.length; i++)
                if (!(r === evalScheem(expr[i], env)))
                    return '#f';
            return '#t';
        case '<':
            if (expr.length < 3)
                throw '<: expected 2 or more parameters but received ' + (expr.length - 1);
            var r = evalScheem(expr[1], env);
            for (var i = 2; i < expr.length; i++)
                if (!(r < evalScheem(expr[i], env)))
                    return '#f';
            return '#t';
        case '>':
            if (expr.length < 3)
                throw '>: expected 2 or more parameters but received ' + (expr.length - 1);
            var r = evalScheem(expr[1], env);
            for (var i = 2; i < expr.length; i++)
                if (!(r > evalScheem(expr[i], env)))
                    return '#f';
            return '#t';

        case 'define':
            if (expr.length != 3)
                throw 'define: expected 2 parameters but received ' + (expr.length - 1);
            env[expr[1]] = evalScheem(expr[2], env);
            return 0;
        case 'set!':
            if (expr.length != 3)
                throw 'set!: expected 2 parameters but received ' + (expr.length - 1);
            if (typeof env[expr[1]] === 'undefined')
                throw 'undefined symbol: ' + expr[1];
            env[expr[1]] = evalScheem(expr[2], env);
            return 0;
        case 'begin':
            var r;
            for (var i = 1; i < expr.length; i++)
                r = evalScheem(expr[i],env);
            return r;
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
                return;
            return evalScheem(expr[3]);
        case 'cons':
            if (expr.length != 3)
                throw 'cons: expected 2 parameters but received ' + (expr.length - 1);
            return [evalScheem(expr[1], env)]
                .concat(evalScheem(expr[2], env));
        case 'car':
            if (expr.length != 3)
                throw 'car: expected 2 parameters but received ' + (expr.length - 1);
            return evalScheem(expr[1], env)[0];
        case 'cdr':
            if (expr.length != 3)
                throw 'cdr: expected 2 parameters but received ' + (expr.length - 1);
            t = evalScheem(expr[1], env);
            t.splice(0,1);
            return t;
    }
};