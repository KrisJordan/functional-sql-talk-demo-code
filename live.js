// This is what we coded live.

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
// select([
//   'p.first',
//   'p.last',
//   'p.games',
//   'p.points'
// ],
//   orderBy('p.last',
//     where(equals(c('p.games'),19),
//       from('players','p', tables))));

var from = function(table, alias, tables) {
    return _.map(tables[table], prefix(alias));
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
//var data = from("players", "p", tables);

// ORDERBY 'p.last'
var readColumn = function(col) {
    return function(row) {
        return row[col];
    };
};
var orderBy = function(col, data) {
    return _.sortBy(data, readColumn(col));
};
var data = orderBy("p.first",
           from("players","p",tables));




// WHERE p.games = 19
// -- Players who have played every game 
var where = function(predicate, data) {
    return _.filter(data, predicate);
};
var predicate = function(left,right,expr){
    var leftFn = _.isFunction(left) ?
                    left :
                    function(){return left;};
    var rightFn = _.isFunction(right) ?
                    right :
                    function(){return right;};

    return function(row) {
      return expr(leftFn(row), rightFn(row));
    };
};
var greaterThan = function(left,right) {
    return predicate(left,right,function(l,r){
        return l > r;
    });
};
var equals = function(left,right) {
    return predicate(left,right,function(l,r){
        return l === r;
    });
};
var and = function(left,right) {
    return predicate(left,right,function(l,r){
        return l && r;
    });
};
var c = readColumn;
var data =  where(
             and(
                 greaterThan(c('p.number'),39),
                 greaterThan(c('p.points'),200)
             ),
            from("players","p",tables));



// SELECT p.first,p.last



