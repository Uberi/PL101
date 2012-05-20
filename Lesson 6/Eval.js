var lookup = function (env, v) {
    if (!(env.hasOwnProperty('bindings')))
        throw new Error(v + " not found");
    if (env.bindings.hasOwnProperty(v))
        return env.bindings[v];
    return lookup(env.outer, v);
};

var update = function (env, v, val) {
    if (env.bindings.hasOwnProperty(v))
        env.bindings[v] = val;
    else
        update(env.outer, v, val);
};

var evalExpression = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Look at tag to see what to do
    switch (expr.tag) {
        case 'ident':
            return lookup(env, expr.name);
        case '<':
            return evalExpression(expr.left, env) <
                   evalExpression(expr.right, env);
        case '+':
            return evalExpression(expr.left, env) +
                   evalExpression(expr.right, env);
        case '*':
            return evalExpression(expr.left, env) *
                   evalExpression(expr.right, env);
        case 'call':
            // Get function value
            var func = lookup(env, expr.name);
            // Evaluate arguments to pass
            var ev_args = [];
            var i = 0;
            for(i = 0; i < expr.args.length; i++)
                ev_args[i] = evalExpression(expr.args[i], env);
            return func.apply(null, ev_args);
    }
};

var evalStatement = function (stmt, env) {
    // Statements always have tags
    switch(stmt.tag) {
        // A single expression
        case 'ignore':
            // Just evaluate expression
            return evalExpression(stmt.body, env);
        case 'var':
            // New variable gets default value of 0
            env.bindings[stmt.name] = 0;
            return 0;
        case ':=':
            // Evaluate right hand side
            val = evalExpression(stmt.right, env);
            update(env, stmt.left, val);
            return val;
        case 'if':
            if(evalExpression(stmt.expr, env))
                val = evalStatements(stmt.body, env);
            return val;
        case 'repeat':
            var i, val;
            var amount = evalExpression(stmt.expr, env);
            for (i = 0; i < amount; i ++)
                val = evalStatements(stmt.body, env);
            return val;
        case 'define':
            var new_func = function() {
                var i, new_env, new_bindings = {};
                for(i = 0; i < stmt.args.length; i++)
                    new_bindings[stmt.args[i]] = arguments[i];
                new_env = { bindings: new_bindings, outer: env };
                return evalStatements(stmt.body, new_env);
            };
            env.bindings[stmt.name] = new_func;
            return 0;
    }
};

var evalStatements = function (seq, env) {
    var i;
    var val = undefined;
    for(i = 0; i < seq.length; i++)
        val = evalStatement(seq[i], env);
    return val;
};