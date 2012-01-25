// This is a more fleshed out version with rough
// sketches of select, join, and aggregate functions.

var tables = {
    roles: [
        {
            id:     1,
            title: "Point Guard"
        },
        {
            id:     2,
            title: "Shooting Guard"
        },
        {
            id:     3,
            title: "Small Forward"
        },
        {
            id:     4,
            title: "Power Forward"
        },
        {
            id:     5,
            title: "Center"
        }
    ],
    players: [
        {
            id:             1,
            role_id:        1,
            number:         5,
            first:          "Kendall",
            last:           "Marshall",
            games:          19,
            minutes:        593,
            points:         113,
            rebounds:       51,
            assists:        181
        },
        {
            id:             2,
            role_id:        2,
            number:         1,
            first:          "Dexter",
            last:           "Strickland",
            games:          19,
            minutes:        461,
            points:         142,
            rebounds:       39,
            assists:        39
        },
        {
            id:             3,
            role_id:        1,
            number:         11,
            first:          "Stilman",
            last:           "White",
            games:          15,
            minutes:        65,
            points:         13,
            rebounds:       9,
            assists:        12
        },
        {
            id:             4,
            role_id:        5,
            number:         14,
            first:          "Desmond",
            last:           "Hubert",
            games:          14,
            minutes:        69,
            points:         11,
            rebounds:       25,
            assists:        4
        },
        {
            id:             5,
            role_id:        3,
            number:         15,
            first:          "P.J.",
            last:           "Hairston",
            games:          19,
            minutes:        251,
            points:         142,
            rebounds:       39,
            assists:        16
        },
        {
            id:             6,
            role_id:        4,
            number:         21,
            first:          "Jackson",
            last:           "Simmons",
            games:          15,
            minutes:        31,
            points:         9,
            rebounds:       12,
            assists:        1
        },
        {
            id:             7,
            role_id:        3,
            number:         22,
            first:          "David",
            last:           "Dupont",
            games:          14,
            minutes:        20,
            points:         7,
            rebounds:       3,
            assists:        0
        },
        {
            id:             8,
            role_id:        2,
            number:         24,
            first:          "Justin",
            last:           "Watts",
            games:          19,
            minutes:        107,
            points:         28,
            rebounds:       27,
            assists:        2
        },
        {
            id:             9,
            role_id:        1,
            number:         30,
            first:          "Patrick",
            last:           "Crouch",
            games:          15,
            minutes:        27,
            points:         6,
            rebounds:       5,
            assists:        5
        },
        {
            id:             10,
            role_id:        4,
            number:         31,
            first:          "John",
            last:           "Henson",
            games:          19,
            minutes:        532,
            points:         276,
            rebounds:       191,
            assists:        27
        },
        {
            id:             11,
            role_id:        3,
            number:         34,
            first:          "Stewart",
            last:           "Cooper",
            games:          14,
            minutes:        21,
            points:         5,
            rebounds:       1,
            assists:        0
        },
        {
            id:             12,
            role_id:        2,
            number:         35,
            first:          "Reggie",
            last:           "Bullock",
            games:          19,
            minutes:        358,
            points:         159,
            rebounds:       84,
            assists:        17
        },
        {
            id:             13,
            role_id:        3,
            number:         40,
            first:          "Harrison",
            last:           "Barnes",
            games:          19,
            minutes:        500,
            points:         328,
            rebounds:       91,
            assists:        19
        },
        {
            id:             14,
            role_id:        5,
            number:         43,
            first:          "James Michael",
            last:           "McAdoo",
            games:          19,
            minutes:        260,
            points:         104,
            rebounds:       69,
            assists:        5
        },
        {
            id:             15,
            role_id:        5,
            number:         44,
            first:          "Tyler",
            last:           "Zeller",
            games:          19,
            minutes:        505,
            points:         273,
            rebounds:       176,
            assists:        21
        }
    ]
};

// Goal:
// select(['p.first','p.last','p.games','p.points'],
// orderBy('p.last',
// where(equals(c('p.games'),19),
// from('players','p', tables))));

var from = function(table, alias, data) {
    return _.map(data[table], prefix(alias));
};

// Generator Function
// Prepends properties with table alias
var prefix = function(tableAlias) {
    return function(row) {
        var rv = {};
        _.each(row, function(val, col) {
            rv[tableAlias + "." + col] = val;
        });
        return rv;
    };
};
var data = from("players", "p", tables);
// var data = from("roles", "r", tables);

// ORDERBY 'p.last'
// var data =  orderByLastname(
//             from("players","p",tables));
var c = function(col) {
    return function(row) {
        return row[col];
    };
};
var orderBy = function(col, data) {
    return _.sortBy(data, c(col));
};
var orderByDesc = function(col, data) {
    return orderBy(col,data).reverse();
}
var data =  orderBy("p.last",
            from("players", "p", tables));

// WHERE p.games = 19
// -- Players who have played every game 
// var data =  whereGamesEqual19( 
//             from("players","p",tables));
var where = function(predicate, data) {
    return _.filter(data, predicate);
};
var functionize = function(fnOrVal) {
    return _.isFunction(fnOrVal) ? 
                    fnOrVal : 
                    function(){return fnOrVal;};
};

var predicate = function(left, right, expr) {
    var leftFn = functionize(left);
    var rightFn = functionize(right);
    return function(row) {
        return expr(leftFn(row), rightFn(row));
    };
}

var equals = function(left, right) {
    return predicate(left, right, function(l,r) {
        return l === r;
    });
};

var greaterThan = function(left, right) {
    return predicate(left, right, function(l,r) {
        return l > r;
    });
};

var and = function(left, right) {
    return predicate(left, right, function(l,r) {
        return l && r;
    });
};

var data =  where(
            and(
                greaterThan(c('p.minutes'),200),
                equals(c('p.games'),19)
            ),
            orderByDesc("p.minutes",
            from("players", "p", tables)));

// SELECT p.first,p.last
var projectColumns = function(cols) {
    return function(row) {
        var rv = {};
        _.each(cols,function(col){
            rv[col] = row[col];
        });
        return rv;
    };
};

var select = function(cols, data) {
    return _.map(data, projectColumns(cols));
}

var data =  select(['p.first','p.last','p.games','p.points'],
            where(
            and(
                greaterThan(c('p.minutes'),200),
                equals(c('p.games'),19)
            ),
            orderByDesc("p.minutes",
            from("players", "p", tables))));

// Select with aggregate support
var select = function(cols, data) {
    if(!_.any(cols, _.isFunction)) {
        // normal select
        return _.map(data, function(row) {
            var r = {};
            _.each(cols, function(col) {
                r[col] = row[col];
            });
            return r;
        });
    } else {
        // aggregate select
        var r = {};
        _.each(cols, function(col) {
            if(_.isFunction(col)) {
                r[col.as] = _.reduce(data, col, 0);
            } else {
                // Property name
                r[col] = data[0][col];
            }
        });
        return [r];
    }
};

var join = function(table, alias, tables, data) {
    var joinData = from(table, alias, tables);
    var cross = [];
    _.each(data, function(rowLeft) {
        _.each(joinData, function(rowRight) {
            cross.push(_.extend({}, rowLeft, rowRight));
        });
    });
    return cross;
};

// Aggregate Functions

var sum = function(col, as) {
    var sumFn = function(memo, row) {
        return memo + row[col];
    };
    sumFn.as = as;
    return sumFn;
};

var count = function(col, as) {
    var countFn = function(memo, num) {
        return memo + 1;
    };
    countFn.as = as;
    return countFn;
};

data =  select(['r.title','p.first','p.last','p.minutes','p.points'], 
        orderBy('r.id',
        where(
            and(
                greaterThan(c('p.minutes'),400),
                equals(c('r.id'),c('p.role_id'))
            ),
        join("roles","r",tables,
        from("players","p",tables)))));

data =  select([sum('p.points','points total')], 
        orderBy('r.id',
        where(
            and(
                greaterThan(c('p.minutes'),400),
                equals(c('r.id'),c('p.role_id'))
            ),
        join("roles","r",tables,
        from("players","p",tables)))));
