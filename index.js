// const
const PLATFORM = [
    {name: 'Nintendo', member: ['Wii', 'NES', 'GB', 'DS', 'SNES', 'GBA', '3DS', 'N64', 'GC', 'WiiU']},
    {name: 'Microsoft', member: ['X360', 'XB', 'XOne']},
    {name: 'Sony', member: ['PS3', 'PS2', 'PS4', 'PS', 'PSP', 'PSV']},
    {name: 'Others', member: ['2600', 'GEN', 'DC', 'SAT', 'SCD', 'WS', 'NG', 'TG16', 'PC', '3DO', 'GG', 'PCFX']}
];
const AREA  = ['NA', 'EU', 'JP', 'Others'];
const GENRE = ['Action', 'Adventure', 'Fighting', 'Misc', 'Platform', 'Puzzle', 'Racing', 'Role-Playing', 'Shooter', 'Simulation', 'Sports', 'Strategy'];
const COLOR = d3.scale.category20b();

var od          = {};
var fd_year     = [];
var fd_platform = [];
var fd_area     = [];
var fd_genre    = [];
var hd          = [];
var pd          = [];
var ad          = [];
var gd          = [];
var update      = {};

d3.csv('vgsales.csv', (data) => {
    od = data;

    data.forEach(addData);
    fd_year.sort((a, b) => {return a.year - b.year});

    hd = fd_year.map((d) => {return {year: d.year, sale: d.sale}});
    pd = PLATFORM.map((d) => {
        return {name: d.name, sale: d3.sum(fd_year.map((e) => {
            return e.platform[d.name]}))}});
    ad = AREA.map((d) => {
        return {area: d, sale: d3.sum(fd_year.map((e) => {
            return e.area[d]}))}});
    gd = GENRE.map((d) => {
        return {genre: d, sale: d3.sum(fd_year.map((e) => {
            return e.genre[d == 'Role-Playing' ? 'RolePlaying' : d]}))}});

    histogram(hd);
    platform(pd);
    area(ad);
    genre(gd);
});

function addData(data) {
    var getElem = fd_year.find((d) => {return d.year == data.Year;});

    if (getElem == null && data.Year != 'N/A') {
        var tmp = {
            year:     Number(data.Year),
            sale:     Number(data.Global_Sales),
            platform: {
                Nintendo:  Number(0),
                Microsoft: Number(0),
                Sony:      Number(0),
                Others:    Number(0)
            },
            area: {
                NA:     Number(data.NA_Sales),
                EU:     Number(data.EU_Sales),
                JP:     Number(data.JP_Sales),
                Others: Number(data.Other_Sales)
            },
            genre: {
                Action:      Number(0),
                Adventure:   Number(0),
                Fighting:    Number(0),
                Misc:        Number(0),
                Platform:    Number(0),
                Puzzle:      Number(0),
                Racing:      Number(0),
                RolePlaying: Number(0),
                Shooter:     Number(0),
                Simulation:  Number(0),
                Sports:      Number(0),
                Strategy:    Number(0)
            }
        };

        for (var i = 0; i < PLATFORM.length; i++) {
            if (PLATFORM[i].member.some((d) => {return d == data.Platform;})) {
                tmp.platform[PLATFORM[i].name] += Number(data.Global_Sales);
                break;
            }
        }

        for (var i = 0; i < GENRE.length; i++) {
            if (GENRE[i] == data.Genre) {
                tmp.genre[GENRE[i] == 'Role-Playing' ? 'RolePlaying' : GENRE[i]] += Number(data.Global_Sales);
                break;
            }
        }

        fd_year.push(tmp);
    } else if (getElem) {
        getElem.sale        += Number(data.Global_Sales);
        getElem.area.NA     += Number(data.NA_Sales);
        getElem.area.EU     += Number(data.EU_Sales);
        getElem.area.JP     += Number(data.JP_Sales);
        getElem.area.Others += Number(data.Other_Sales);

        for (var i = 0; i < PLATFORM.length; i++) {
            if (PLATFORM[i].member.some((d) => {return d == data.Platform;})) {
                getElem.platform[PLATFORM[i].name] += Number(data.Global_Sales);
                break;
            }
        }

        for (var i = 0; i < GENRE.length; i++) {
            if (GENRE[i] == data.Genre) {
                getElem.genre[GENRE[i] == 'Role-Playing' ? 'RolePlaying' : GENRE[i]] += Number(data.Global_Sales);
                break;
            }
        }
    }

    var name = null;

    for (var i = 0; i < PLATFORM.length; i++) {
        if (PLATFORM[i].member.some((d) => {return d == data.Platform;})) {
            name = PLATFORM[i].name;
            getElem = fd_platform.find((d) => {return d.name == name;});
            break;
        }
    }

    if (getElem == null) {
        var tmp = {
            name:     name,
            sale:     Number(data.Global_Sales),
            area: {
                NA:     Number(data.NA_Sales),
                EU:     Number(data.EU_Sales),
                JP:     Number(data.JP_Sales),
                Others: Number(data.Other_Sales)
            },
            genre: {
                Action:      Number(0),
                Adventure:   Number(0),
                Fighting:    Number(0),
                Misc:        Number(0),
                Platform:    Number(0),
                Puzzle:      Number(0),
                Racing:      Number(0),
                RolePlaying: Number(0),
                Shooter:     Number(0),
                Simulation:  Number(0),
                Sports:      Number(0),
                Strategy:    Number(0)
            }
        };

        for (var i = 0; i < GENRE.length; i++) {
            if (GENRE[i] == data.Genre) {
                tmp.genre[GENRE[i] == 'Role-Playing' ? 'RolePlaying' : GENRE[i]] += Number(data.Global_Sales);
                break;
            }
        }

        fd_platform.push(tmp);
    } else {
        getElem.sale        += Number(data.Global_Sales);
        getElem.area.NA     += Number(data.NA_Sales);
        getElem.area.EU     += Number(data.EU_Sales);
        getElem.area.JP     += Number(data.JP_Sales);
        getElem.area.Others += Number(data.Other_Sales);

        for (var i = 0; i < GENRE.length; i++) {
            if (GENRE[i] == data.Genre) {
                getElem.genre[GENRE[i] == 'Role-Playing' ? 'RolePlaying' : GENRE[i]] += Number(data.Global_Sales);
                break;
            }
        }
    }

    getElem = fd_area.find((d) => {return d.area == 'NA'});

    if (getElem == null) {
        var tmp = {
            area:     'NA',
            sale:     Number(data.NA_Sales),
            platform: {
                Nintendo:  Number(0),
                Microsoft: Number(0),
                Sony:      Number(0),
                Others:    Number(0)
            },
            genre: {
                Action:      Number(0),
                Adventure:   Number(0),
                Fighting:    Number(0),
                Misc:        Number(0),
                Platform:    Number(0),
                Puzzle:      Number(0),
                Racing:      Number(0),
                RolePlaying: Number(0),
                Shooter:     Number(0),
                Simulation:  Number(0),
                Sports:      Number(0),
                Strategy:    Number(0)
            }
        };

        for (var i = 0; i < PLATFORM.length; i++) {
            if (PLATFORM[i].member.some((d) => {return d == data.Platform;})) {
                tmp.platform[PLATFORM[i].name] += Number(data.NA_Sales);
                break;
            }
        }

        for (var i = 0; i < GENRE.length; i++) {
            if (GENRE[i] == data.Genre) {
                tmp.genre[GENRE[i] == 'Role-Playing' ? 'RolePlaying' : GENRE[i]] += Number(data.NA_Sales);
                break;
            }
        }

        fd_area.push(tmp);
    } else {
        getElem.sale += Number(data.NA_Sales);

        for (var i = 0; i < PLATFORM.length; i++) {
            if (PLATFORM[i].member.some((d) => {return d == data.Platform;})) {
                getElem.platform[PLATFORM[i].name] += Number(data.NA_Sales);
                break;
            }
        }

        for (var i = 0; i < GENRE.length; i++) {
            if (GENRE[i] == data.Genre) {
                getElem.genre[GENRE[i] == 'Role-Playing' ? 'RolePlaying' : GENRE[i]] += Number(data.NA_Sales);
                break;
            }
        }
    }

    getElem = fd_area.find((d) => {return d.area == 'EU'});

    if (getElem == null) {
        var tmp = {
            area:     'EU',
            sale:     Number(data.EU_Sales),
            platform: {
                Nintendo:  Number(0),
                Microsoft: Number(0),
                Sony:      Number(0),
                Others:    Number(0)
            },
            genre: {
                Action:      Number(0),
                Adventure:   Number(0),
                Fighting:    Number(0),
                Misc:        Number(0),
                Platform:    Number(0),
                Puzzle:      Number(0),
                Racing:      Number(0),
                RolePlaying: Number(0),
                Shooter:     Number(0),
                Simulation:  Number(0),
                Sports:      Number(0),
                Strategy:    Number(0)
            }
        };

        for (var i = 0; i < PLATFORM.length; i++) {
            if (PLATFORM[i].member.some((d) => {return d == data.Platform;})) {
                tmp.platform[PLATFORM[i].name] += Number(data.EU_Sales);
                break;
            }
        }

        for (var i = 0; i < GENRE.length; i++) {
            if (GENRE[i] == data.Genre) {
                tmp.genre[GENRE[i] == 'Role-Playing' ? 'RolePlaying' : GENRE[i]] += Number(data.EU_Sales);
                break;
            }
        }

        fd_area.push(tmp);
    } else {
        getElem.sale += Number(data.EU_Sales);

        for (var i = 0; i < PLATFORM.length; i++) {
            if (PLATFORM[i].member.some((d) => {return d == data.Platform;})) {
                getElem.platform[PLATFORM[i].name] += Number(data.EU_Sales);
                break;
            }
        }

        for (var i = 0; i < GENRE.length; i++) {
            if (GENRE[i] == data.Genre) {
                getElem.genre[GENRE[i] == 'Role-Playing' ? 'RolePlaying' : GENRE[i]] += Number(data.EU_Sales);
                break;
            }
        }
    }

    getElem = fd_area.find((d) => {return d.area == 'JP'});

    if (getElem == null) {
        var tmp = {
            area:     'JP',
            sale:     Number(data.JP_Sales),
            platform: {
                Nintendo:  Number(0),
                Microsoft: Number(0),
                Sony:      Number(0),
                Others:    Number(0)
            },
            genre: {
                Action:      Number(0),
                Adventure:   Number(0),
                Fighting:    Number(0),
                Misc:        Number(0),
                Platform:    Number(0),
                Puzzle:      Number(0),
                Racing:      Number(0),
                RolePlaying: Number(0),
                Shooter:     Number(0),
                Simulation:  Number(0),
                Sports:      Number(0),
                Strategy:    Number(0)
            }
        };

        for (var i = 0; i < PLATFORM.length; i++) {
            if (PLATFORM[i].member.some((d) => {return d == data.Platform;})) {
                tmp.platform[PLATFORM[i].name] += Number(data.JP_Sales);
                break;
            }
        }

        for (var i = 0; i < GENRE.length; i++) {
            if (GENRE[i] == data.Genre) {
                tmp.genre[GENRE[i] == 'Role-Playing' ? 'RolePlaying' : GENRE[i]] += Number(data.JP_Sales);
                break;
            }
        }

        fd_area.push(tmp);
    } else {
        getElem.sale += Number(data.JP_Sales);

        for (var i = 0; i < PLATFORM.length; i++) {
            if (PLATFORM[i].member.some((d) => {return d == data.Platform;})) {
                getElem.platform[PLATFORM[i].name] += Number(data.JP_Sales);
                break;
            }
        }

        for (var i = 0; i < GENRE.length; i++) {
            if (GENRE[i] == data.Genre) {
                getElem.genre[GENRE[i] == 'Role-Playing' ? 'RolePlaying' : GENRE[i]] += Number(data.JP_Sales);
                break;
            }
        }
    }

    getElem = fd_area.find((d) => {return d.area == 'Others'});

    if (getElem == null) {
        var tmp = {
            area:     'Others',
            sale:     Number(data.Other_Sales),
            platform: {
                Nintendo:  Number(0),
                Microsoft: Number(0),
                Sony:      Number(0),
                Others:    Number(0)
            },
            genre: {
                Action:      Number(0),
                Adventure:   Number(0),
                Fighting:    Number(0),
                Misc:        Number(0),
                Platform:    Number(0),
                Puzzle:      Number(0),
                Racing:      Number(0),
                RolePlaying: Number(0),
                Shooter:     Number(0),
                Simulation:  Number(0),
                Sports:      Number(0),
                Strategy:    Number(0)
            }
        };

        for (var i = 0; i < PLATFORM.length; i++) {
            if (PLATFORM[i].member.some((d) => {return d == data.Platform;})) {
                tmp.platform[PLATFORM[i].name] += Number(data.Other_Sales);
                break;
            }
        }

        for (var i = 0; i < GENRE.length; i++) {
            if (GENRE[i] == data.Genre) {
                tmp.genre[GENRE[i] == 'Role-Playing' ? 'RolePlaying' : GENRE[i]] += Number(data.Other_Sales);
                break;
            }
        }

        fd_area.push(tmp);
    } else {
        getElem.sale += Number(data.Other_Sales);

        for (var i = 0; i < PLATFORM.length; i++) {
            if (PLATFORM[i].member.some((d) => {return d == data.Platform;})) {
                getElem.platform[PLATFORM[i].name] += Number(data.Other_Sales);
                break;
            }
        }

        for (var i = 0; i < GENRE.length; i++) {
            if (GENRE[i] == data.Genre) {
                getElem.genre[GENRE[i] == 'Role-Playing' ? 'RolePlaying' : GENRE[i]] += Number(data.Other_Sales);
                break;
            }
        }
    }

    getElem = fd_genre.find((d) => {return d.genre == (data.Genre == 'Role-Playing' ? 'RolePlaying' : data.Genre)});

    if (getElem == null) {
        var tmp = {
            genre:    data.Genre == 'Role-Playing' ? 'RolePlaying' : data.Genre,
            sale:     Number(data.Global_Sales),
            platform: {
                Nintendo:  Number(0),
                Microsoft: Number(0),
                Sony:      Number(0),
                Others:    Number(0)
            },
            area: {
                NA:     Number(data.NA_Sales),
                EU:     Number(data.EU_Sales),
                JP:     Number(data.JP_Sales),
                Others: Number(data.Other_Sales)
            }

        };

        for (var i = 0; i < PLATFORM.length; i++) {
            if (PLATFORM[i].member.some((d) => {return d == data.Platform;})) {
                tmp.platform[PLATFORM[i].name] += Number(data.Global_Sales);
                break;
            }
        }

        fd_genre.push(tmp);
    } else {
        getElem.sale        += Number(data.Global_Sales);
        getElem.area.NA     += Number(data.NA_Sales);
        getElem.area.EU     += Number(data.EU_Sales);
        getElem.area.JP     += Number(data.JP_Sales);
        getElem.area.Others += Number(data.Other_Sales);

        for (var i = 0; i < PLATFORM.length; i++) {
            if (PLATFORM[i].member.some((d) => {return d == data.Platform;})) {
                getElem.platform[PLATFORM[i].name] += Number(data.Global_Sales);
                break;
            }
        }
    }
}

function histogram(data) {
    d3.select('.histogram').node().innerHTML = "";

    const svg  = d3.select('.histogram').append('svg');
    const rect = svg.node().getBoundingClientRect();
    const m    = {
        top:    30,
        right:  30,
        bottom: 30,
        left:   30
    };

    svg.append('text')
        .text('(單位:百萬份/年)')
        .attr('x', '10')
        .attr('y', '20')
        .style('fill', '#d0b0b0')
        .style('font-size', '20px')
        .style('font-weight', 'bold')
        .style('font-family', 'Courier New');

    var x = d3.scale.ordinal()
        .domain(data.map((d) => {return d.year;}))
        .rangeRoundBands([0, rect.width - m.left - m.right], 0.1);

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + m.left + ', ' + (rect.height - m.bottom) + ')')
        .call(d3.svg.axis().scale(x).orient('bottom'));

    var y = d3.scale.linear()
        .domain([0, d3.max(data, (d) => {return d.sale;})])
        .range([rect.height - m.top - m.bottom, 0]);

    var bars = svg.selectAll('.bar')
        .data(data)
        .enter().append('g')
            .attr('class', 'bar')
            .attr('transform', 'translate(' + m.left + ', ' + m.top + ')')
            .on('mouseover', (d) => {
                var p = PLATFORM.map((e) => {
                    return {name: e.name, sale: fd_year.find((f) => {
                        return f.year == d.year}).platform[e.name]}});

                var a = AREA.map((e) => {
                    return {area: e, sale: fd_year.find((f) => {
                        return f.year == d.year}).area[e]}});

                var g = GENRE.map((e) => {
                    return {genre: e, sale: fd_year.find((f) => {
                        return f.year == d.year;
                    }).genre[e == 'Role-Playing' ? 'RolePlaying' : e]}
                })

                update.platform(p);
                update.area(a);
                update.genre(g);
            })
            .on('mouseout', function(d) {
                update.platform(pd);
                update.area(ad);
                update.genre(gd);
            });

    bars.append('rect')
        .attr('x', (d) => {return x(d.year);})
        .attr('y', (d) => {return rect.height - m.top - m.bottom;})
        .attr('width', x.rangeBand())
        .attr('height', '0')
        .attr('fill', 'steelblue');

    bars.append('text')
        .text((d) => {return d.sale.toFixed(0);})
        .attr('x', (d) => {return x(d.year) + x.rangeBand() / 2;})
        .attr('y', (d) => {return rect.height - m.top - m.bottom - 5;})
        .attr('text-anchor', 'middle');

    bars = d3.selectAll('.bar');

    bars.select('rect')
        .transition().duration(500)
        .attr('y', (d) => {return y(d.sale);})
        .attr('height', (d) => {return rect.height - m.top - m.bottom - y(d.sale);})

    bars.select('text')
        .transition().duration(500)
        .attr('y', (d) => {return y(d.sale) - 5;});

    update.histogram = function (data, color) {
        y.domain([0, d3.max(data, (d) => {return d.sale;})]);

        var bars = d3.selectAll('.bar').data(data);

        bars.select('rect')
            .transition().duration(500)
            .attr('y', (d) => {return y(d.sale);})
            .attr('height', (d) => {return rect.height - m.top - m.bottom - y(d.sale);})
            .attr('fill', color);

        bars.select('text')
            .text((d) => {return d.sale.toFixed(0);})
            .transition().duration(500)
            .attr('y', (d) => {return y(d.sale) - 5;});
    };
}

function platform(data) {
    platformPie(data);
    platformLegend(data);

    function platformPie(data) {
        const svg  = d3.select('.platform .pie');
        const rect = svg.node().getBoundingClientRect();

        var arc = d3.svg.arc()
            .outerRadius(d3.min([rect.width / 2, rect.height / 2]) - 10)
            .innerRadius(0);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) {return d.sale});

        svg.selectAll('path')
            .data(pie(data))
            .enter().append('path')
                .each(function(d) {this.current = d;})
                .attr('d', arc)
                .attr('transform', 'translate(' + rect.width / 2 + ', ' + rect.height / 2 + ')')
                .attr('fill', function(d) {return platformColor(d.data.name);})
                .on('mouseover', function(d) {
                    update.histogram(fd_year.map(function(e) {return {year: e.year, sale: e.platform[d.data.name]};}), platformColor(d.data.name));
                })
                .on('mouseout', function(d) {
                    update.histogram(hd, 'steelblue');
                });

        update.platformPie = function (data) {
            svg.selectAll('path')
                .data(pie(data))
                .transition().duration(500)
                .attrTween('d', function(d) {
                    var t = d3.interpolate(this.current, d);
                    this.current = t(0);
                    return function(e) {return arc(t(e));};
                });
        };
    }

    function platformLegend(data) {
        const svg  = d3.select('.platform .legend');
        const rect = svg.node().getBoundingClientRect();
        const m    = {
            top:    20,
            right:  10,
            bottom: 10,
            left:   10
        };

        var y = d3.scale.ordinal()
            .domain(data.map((d) => {return d.name;}))
            .rangeRoundBands([0, rect.height - m.top - m.bottom], 0.1);

        var list = svg.selectAll('g')
            .data(data)
            .enter().append('g')
                .attr('transform', 'translate(' + m.left + ', ' + m.top + ')');

        list.append('rect')
            .attr('x', '0')
            .attr('y', (d) => {return y(d.name);})
            .attr('width', '16')
            .attr('height', '16')
            .attr('fill', (d) => {return platformColor(d.name);})
            .on('mouseover', function(d) {
                update.histogram(fd_year.map(function(e) {return {year: e.year, sale: e.platform[d.name]};}), platformColor(d.name));
            })
            .on('mouseout', function(d) {
                update.histogram(hd, 'steelblue');
            });

        list.append('text')
            .attr('x', (rect.width - m.left - m.right) / 10)
            .attr('y', (d) => {return y(d.name) + 15;})
            .text((d) => {return d.name;})

        list.append('text')
            .attr('class', 'legendSale')
            .attr('x', (rect.width - m.left - m.right) / 6 * 5)
            .attr('y', (d) => {return y(d.name) + 15;})
            .attr('text-anchor', 'end')
            .text((d) => {return d3.format(',')(d.sale.toFixed(0)) + ' M';});

        list.append('text')
            .attr('class', 'legendPercent')
            .attr('x', rect.width - m.left - m.right)
            .attr('y', (d) => {return y(d.name) + 15;})
            .attr('text-anchor', 'end')
            .style('font-weight', 'bold')
            .style('font-family', 'Courier New')
            .text((d) => {return getPercent(d, data);})

        update.platformLegend = function (data) {
            var l = svg.selectAll('g')
                .data(data);

            l.select('.legendSale')
                .text((d) => {return d3.format(',')(d.sale.toFixed(0)) + ' M';});

            l.select('.legendPercent')
                .text((d) => {return getPercent(d, data);})
        }
    }

    update.platform = function (data) {
        update.platformPie(data);
        update.platformLegend(data);
    }
}

function area(data) {
    areaPie(data);
    areaLegend(data);

    function areaPie(data) {
        const svg  = d3.select('.area .pie');
        const rect = svg.node().getBoundingClientRect();

        var arc = d3.svg.arc()
            .outerRadius(d3.min([rect.width / 2, rect.height / 2]) - 10)
            .innerRadius(0);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) {return d.sale});

        svg.selectAll('path')
            .data(pie(data))
            .enter().append('path')
                .each(function(d) {this.current = d;})
                .attr('d', arc)
                .attr('transform', 'translate(' + rect.width / 2 + ', ' + rect.height / 2 + ')')
                .attr('fill', function(d) {return areaColor(d.data.area);})
                .on('mouseover', function(d) {
                    update.histogram(fd_year.map(function(e) {return {year: e.year, sale: e.area[d.data.area]};}), areaColor(d.data.area))
                })
                .on('mouseout', function(d) {
                    update.histogram(hd, 'steelblue');
                });

        update.areaPie = function (data) {
            svg.selectAll('path')
                .data(pie(data))
                .transition().duration(500)
                .attrTween('d', function(d) {
                    var t = d3.interpolate(this.current, d);
                    this.current = t(0);
                    return function(e) {return arc(t(e));};
                });
        };
    }

    function areaLegend(data) {
        const svg  = d3.select('.area .legend');
        const rect = svg.node().getBoundingClientRect();
        const m    = {
            top:    20,
            right:  10,
            bottom: 10,
            left:   10
        };

        var y = d3.scale.ordinal()
            .domain(data.map(function(d) {return d.area;}))
            .rangeRoundBands([0, rect.height - m.top - m.bottom], 0.1);

        var list = svg.selectAll('g')
            .data(data)
            .enter().append('g')
                .attr('transform', 'translate(' + m.left + ', ' + m.top + ')');

        list.append('rect')
            .attr('x', '0')
            .attr('y', function(d) {return y(d.area);})
            .attr('width', '16')
            .attr('height', '16')
            .attr('fill', function(d) {return areaColor(d.area);})
            .on('mouseover', function(d) {
                update.histogram(fd_year.map(function(e) {return {year: e.year, sale: e.area[d.area]};}), areaColor(d.area))
            })
            .on('mouseout', function(d) {
                update.histogram(hd, 'steelblue');
            });

        list.append('text')
            .attr('x', (rect.width - m.left - m.right) / 10)
            .attr('y', function(d) {return y(d.area) + 15;})
            .text(function(d) {return d.area;})

        list.append('text')
            .attr('class', 'legendSale')
            .attr('x', (rect.width - m.left - m.right) / 6 * 5)
            .attr('y', function(d) {return y(d.area) + 15;})
            .attr('text-anchor', 'end')
            .text(function(d) {return d3.format(',')(d.sale.toFixed(0)) + ' M';});

        list.append('text')
            .attr('class', 'legendPercent')
            .attr('x', rect.width - m.left - m.right)
            .attr('y', function(d) {return y(d.area) + 15;})
            .attr('text-anchor', 'end')
            .style('font-weight', 'bold')
            .style('font-family', 'Courier New')
            .text(function(d) {return getPercent(d, data);})

        update.areaLegend = function (data) {
            var l = svg.selectAll('g')
                .data(data);

            l.select('.legendSale')
                .text(function(d) {return d3.format(',')(d.sale.toFixed(0)) + ' M';});

            l.select('.legendPercent')
                .text(function(d) {return getPercent(d, data);})
        }
    }

    update.area = function (data) {
        update.areaPie(data);
        update.areaLegend(data);
    }
}

function genre(data) {
    genrePie(data);
    genreLegend(data);

    function genrePie(data) {
        const svg = d3.select('.genre .pie');
        const rect = svg.node().getBoundingClientRect();

        var arc = d3.svg.arc()
            .outerRadius(d3.min([rect.width / 2, rect.height / 2]) - 10)
            .innerRadius(0);

        var pie = d3.layout.pie()
            .sort(null)
            .value((d) => {return d.sale});

        svg.selectAll('path')
            .data(pie(data))
            .enter().append('path')
                .each(function(d) {this.current = d;})
                .attr('d', arc)
                .attr('transform', 'translate(' + rect.width / 2 + ', ' + rect.height / 2 + ')')
                .attr('fill', (d) => {return genreColor(d.data.genre)})
                .on('mouseover', (d) => {
                    update.histogram(fd_year.map(function(e) {return {year: e.year, sale: e.genre[d.data.genre == 'Role-Playing' ? 'RolePlaying' : d.data.genre]};}), genreColor(d.data.genre))
                })
                .on('mouseout', (d) => {
                    update.histogram(hd, 'steelblue');
                })

        update.genrePie = function (data) {
            svg.selectAll('path')
                .data(pie(data))
                .transition().duration(500)
                .attrTween('d', function(d) {
                    var t = d3.interpolate(this.current, d);
                    this.current = t(0);
                    return function(e) {return arc(t(e));};
                });
        };
    }

    function genreLegend(data) {
        const svg  = d3.select('.genre .legend');
        const rect = svg.node().getBoundingClientRect();
        const m    = {
            top:    20,
            right:  10,
            bottom: 10,
            left:   10
        };

        var y = d3.scale.ordinal()
            .domain(data.map(function(d) {return d.genre;}))
            .rangeRoundBands([0, rect.height - m.top - m.bottom], 0.1);

        var list = svg.selectAll('g')
            .data(data)
            .enter().append('g')
                .attr('transform', 'translate(' + m.left + ', ' + m.top + ')');

        list.append('rect')
            .attr('x', '0')
            .attr('y', function(d) {return y(d.genre);})
            .attr('width', '16')
            .attr('height', '16')
            .attr('fill', function(d) {return genreColor(d.genre);})
            .on('mouseover', (d) => {
                update.histogram(fd_year.map(function(e) {return {year: e.year, sale: e.genre[d.genre == 'Role-Playing' ? 'RolePlaying' : d.genre]};}), genreColor(d.genre))
            })
            .on('mouseout', (d) => {
                update.histogram(hd, 'steelblue');
            })

        list.append('text')
            .attr('x', (rect.width - m.left - m.right) / 10)
            .attr('y', function(d) {return y(d.genre) + 15;})
            .text(function(d) {return d.genre;})

        list.append('text')
            .attr('class', 'legendSale')
            .attr('x', (rect.width - m.left - m.right) / 6 * 5)
            .attr('y', function(d) {return y(d.genre) + 15;})
            .attr('text-anchor', 'end')
            .text(function(d) {return d3.format(',')(d.sale.toFixed(0)) + ' M';});

        list.append('text')
            .attr('class', 'legendPercent')
            .attr('x', rect.width - m.left - m.right)
            .attr('y', function(d) {return y(d.genre) + 15;})
            .attr('text-anchor', 'end')
            .style('font-weight', 'bold')
            .style('font-family', 'Courier New')
            .text(function(d) {return getPercent(d, data);})

        update.genreLegend = function (data) {
            var l = svg.selectAll('g')
                .data(data);

            l.select('.legendSale')
                .text(function(d) {return d3.format(',')(d.sale.toFixed(0)) + ' M';});

            l.select('.legendPercent')
                .text(function(d) {return getPercent(d, data);})
        }
    }

    update.genre = function (data) {
        update.genrePie(data);
        update.genreLegend(data);
    }
}

function getPercent(d, data) {
    return d3.format('%')(d.sale / d3.sum(data.map(function(e) {return e.sale;})));
}

function platformColor(c) {
    return {Nintendo: COLOR(1), Microsoft: COLOR(2), Sony: COLOR(3), Others: COLOR(4)}[c];
}

function areaColor(c) {
    return {EU: COLOR(5), JP: COLOR(6), NA: COLOR(7), Others: COLOR(8)}[c];
}

function genreColor(c) {
    return {
        Action:      COLOR(9),
        Adventure:   COLOR(10),
        Fighting:    COLOR(11),
        Misc:        COLOR(12),
        Platform:    COLOR(13),
        Puzzle:      COLOR(14),
        Racing:      COLOR(15),
        RolePlaying: COLOR(16),
        Shooter:     COLOR(17),
        Simulation:  COLOR(18),
        Sports:      COLOR(19),
        Strategy:    COLOR(20)
    }[c];
}

function btnYear() {
    d3.select('.histogram').node().innerHTML = "";

    hd = fd_year.map((d) => {return {year: d.year, sale: d.sale}});
    pd = PLATFORM.map((d) => {
        return {name: d.name, sale: d3.sum(fd_year.map((e) => {
            return e.platform[d.name]}))}});
    ad = AREA.map((d) => {
        return {area: d, sale: d3.sum(fd_year.map((e) => {
            return e.area[d]}))}});
    gd = GENRE.map((d) => {
        return {genre: d, sale: d3.sum(fd_year.map((e) => {
            return e.genre[d == 'Role-Playing' ? 'RolePlaying' : d]}))}});

    const svg  = d3.select('.histogram').append('svg');
    const rect = svg.node().getBoundingClientRect();
    const m    = {
        top:    30,
        right:  30,
        bottom: 30,
        left:   30
    };

    svg.append('text')
        .text('(單位:百萬份/年)')
        .attr('x', '10')
        .attr('y', '20')
        .style('fill', '#d0b0b0')
        .style('font-size', '20px')
        .style('font-weight', 'bold')
        .style('font-family', 'Courier New');

    var x = d3.scale.ordinal()
        .domain(hd.map((d) => {return d.year;}))
        .rangeRoundBands([0, rect.width - m.left - m.right], 0.1);

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + m.left + ', ' + (rect.height - m.bottom) + ')')
        .call(d3.svg.axis().scale(x).orient('bottom'));

    var y = d3.scale.linear()
        .domain([0, d3.max(hd, (d) => {return d.sale;})])
        .range([rect.height - m.top - m.bottom, 0]);

    var bars = svg.selectAll('.bar')
        .data(hd)
        .enter().append('g')
            .attr('class', 'bar')
            .attr('transform', 'translate(' + m.left + ', ' + m.top + ')')
            .on('mouseover', (d) => {
                var p = PLATFORM.map((e) => {
                    return {name: e.name, sale: fd_year.find((f) => {
                        return f.year == d.year}).platform[e.name]}});

                var a = AREA.map((e) => {
                    return {area: e, sale: fd_year.find((f) => {
                        return f.year == d.year}).area[e]}});

                var g = GENRE.map((e) => {
                    return {genre: e, sale: fd_year.find((f) => {
                        return f.year == d.year;
                    }).genre[e == 'Role-Playing' ? 'RolePlaying' : e]}
                })

                update.platform(p);
                update.area(a);
                update.genre(g);
            })
            .on('mouseout', function(d) {
                update.platform(pd);
                update.area(ad);
                update.genre(gd);
            });

    bars.append('rect')
        .attr('x', (d) => {return x(d.year);})
        .attr('y', (d) => {return rect.height - m.top - m.bottom;})
        .attr('width', x.rangeBand())
        .attr('height', '0')
        .attr('fill', 'steelblue');

    bars.append('text')
        .text((d) => {return d.sale.toFixed(0);})
        .attr('x', (d) => {return x(d.year) + x.rangeBand() / 2;})
        .attr('y', (d) => {return rect.height - m.top - m.bottom - 5;})
        .attr('text-anchor', 'middle');

    bars = d3.selectAll('.bar');

    bars.select('rect')
        .transition().duration(500)
        .attr('y', (d) => {return y(d.sale);})
        .attr('height', (d) => {return rect.height - m.top - m.bottom - y(d.sale);})

    bars.select('text')
        .transition().duration(500)
        .attr('y', (d) => {return y(d.sale) - 5;});

    update.histogram = function (data, color) {
        y.domain([0, d3.max(data, (d) => {return d.sale;})]);

        var bars = d3.selectAll('.bar').data(data);

        bars.select('rect')
            .transition().duration(500)
            .attr('y', (d) => {return y(d.sale);})
            .attr('height', (d) => {return rect.height - m.top - m.bottom - y(d.sale);})
            .attr('fill', color);

        bars.select('text')
            .text((d) => {return d.sale.toFixed(0);})
            .transition().duration(500)
            .attr('y', (d) => {return y(d.sale) - 5;});
    };

    d3.select('.platform .pie').selectAll('path')
        .on('mouseover', function(d) {
            update.histogram(fd_year.map(function(e) {
                return {year: e.year, sale: e.platform[d.data.name]};}), platformColor(d.data.name));});

    d3.select('.area .pie').selectAll('path')
        .on('mouseover', function(d) {
            update.histogram(fd_year.map(function(e) {
                return {year: e.year, sale: e.area[d.data.area]};}), areaColor(d.data.area))});

    d3.select('.genre .pie').selectAll('path')
        .on('mouseover', function(d) {
            update.histogram(fd_year.map(function(e) {
                return {year: e.year, sale: e.genre[d.data.genre == 'Role-Playing' ? 'RolePlaying' : d.data.genre]};}), genreColor(d.data.genre))});

    d3.select('.platform .legend').selectAll('g').select('rect')
        .on('mouseover', function(d) {
            update.histogram(fd_year.map(function(e) {return {year: e.year, sale: e.platform[d.name]};}), platformColor(d.name));
        });

    d3.select('.area .legend').selectAll('g').select('rect')
        .on('mouseover', function(d) {
            update.histogram(fd_year.map(function(e) {return {year: e.year, sale: e.area[d.area]};}), areaColor(d.area))
        });

    d3.select('.genre .legend').selectAll('g').select('rect')
        .on('mouseover', function(d) {
            update.histogram(fd_year.map(function(e) {return {year: e.year, sale: e.genre[d.genre == 'Role-Playing' ? 'RolePlaying' : d.genre]};}), genreColor(d.genre))
        });

    update.platform(pd);
    update.area(ad);
    update.genre(gd);
}

function btnPlatform() {
    d3.select('.histogram').node().innerHTML = "";

    hd = fd_platform.map((d) => {return {name: d.name, sale: d.sale}});
    pd = PLATFORM.map((d) => {
        return {name: d.name, sale: fd_platform.find((e) => {
            return e.name == d.name}).sale}});
    ad = AREA.map((d) => {
        return {area: d, sale: d3.sum(fd_platform.map((e) => {
            return e.area[d]}))}});
    gd = GENRE.map((d) => {
        return {genre: d, sale: d3.sum(fd_platform.map((e) => {
            return e.genre[d == 'Role-Playing' ? 'RolePlaying' : d]}))}});

    const svg  = d3.select('.histogram').append('svg');
    const rect = svg.node().getBoundingClientRect();
    const m    = {
        top:    30,
        right:  30,
        bottom: 30,
        left:   30
    };

    svg.append('text')
        .text('(單位:百萬份/平台)')
        .attr('x', '10')
        .attr('y', '20')
        .style('fill', '#d0b0b0')
        .style('font-size', '20px')
        .style('font-weight', 'bold')
        .style('font-family', 'Courier New');

    var x = d3.scale.ordinal()
        .domain(hd.map((d) => {return d.name;}))
        .rangeRoundBands([0, rect.width - m.left - m.right], 0.1);

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + m.left + ', ' + (rect.height - m.bottom) + ')')
        .call(d3.svg.axis().scale(x).orient('bottom'));

    var y = d3.scale.linear()
        .domain([0, d3.max(hd, (d) => {return d.sale;})])
        .range([rect.height - m.top - m.bottom, 0]);

    var bars = svg.selectAll('.bar')
        .data(hd)
        .enter().append('g')
            .attr('class', 'bar')
            .attr('transform', 'translate(' + m.left + ', ' + m.top + ')')
            .on('mouseover', (d) => {
                var p = pd;

                var a = AREA.map((e) => {
                    return {area: e, sale: fd_platform.find((f) => {
                        return f.name == d.name}).area[e]}});

                var g = GENRE.map((e) => {
                    return {genre: e, sale: fd_platform.find((f) => {
                        return f.name == d.name}).genre[e == 'Role-Playing' ? 'RolePlaying' : e]}});

                update.platform(p);
                update.area(a);
                update.genre(g);
            })
            .on('mouseout', function(d) {
                update.platform(pd);
                update.area(ad);
                update.genre(gd);
            });

    bars.append('rect')
        .attr('x', (d) => {return x(d.name);})
        .attr('y', (d) => {return rect.height - m.top - m.bottom;})
        .attr('width', x.rangeBand())
        .attr('height', '0')
        .attr('fill', 'steelblue');

    bars.append('text')
        .text((d) => {return d.sale.toFixed(0);})
        .attr('x', (d) => {return x(d.name) + x.rangeBand() / 2;})
        .attr('y', (d) => {return rect.height - m.top - m.bottom - 5;})
        .attr('text-anchor', 'middle');

    bars = d3.selectAll('.bar');

    bars.select('rect')
        .transition().duration(500)
        .attr('y', (d) => {return y(d.sale);})
        .attr('height', (d) => {return rect.height - m.top - m.bottom - y(d.sale);})

    bars.select('text')
        .transition().duration(500)
        .attr('y', (d) => {return y(d.sale) - 5;});

    update.histogram = function (data, color) {
        y.domain([0, d3.max(data, (d) => {return d.sale;})]);

        var bars = d3.selectAll('.bar').data(data);

        bars.select('rect')
            .transition().duration(500)
            .attr('y', (d) => {return y(d.sale);})
            .attr('height', (d) => {return rect.height - m.top - m.bottom - y(d.sale);})
            .attr('fill', color);

        bars.select('text')
            .text((d) => {return d.sale.toFixed(0);})
            .transition().duration(500)
            .attr('y', (d) => {return y(d.sale) - 5;});
    };

    d3.select('.platform .pie').selectAll('path')
        .on('mouseover', function(d) {});

    d3.select('.area .pie').selectAll('path')
        .on('mouseover', function(d) {
            update.histogram(fd_platform.map(function(e) {
                return {name: e.name, sale: e.area[d.data.area]};}), areaColor(d.data.area))});

    d3.select('.genre .pie').selectAll('path')
        .on('mouseover', function(d) {
            update.histogram(fd_platform.map(function(e) {
                return {name: e.name, sale: e.genre[d.data.genre == 'Role-Playing' ? 'RolePlaying' : d.data.genre]};}), genreColor(d.data.genre))});

    d3.select('.platform .legend').selectAll('g').select('rect')
        .on('mouseover', function(d) {});

    d3.select('.area .legend').selectAll('g').select('rect')
        .on('mouseover', function(d) {
            update.histogram(fd_platform.map(function(e) {
                return {name: e.name, sale: e.area[d.area]};}), areaColor(d.area))});

    d3.select('.genre .legend').selectAll('g').select('rect')
        .on('mouseover', function(d) {
            update.histogram(fd_platform.map(function(e) {
                return {name: e.name, sale: e.genre[d.genre == 'Role-Playing' ? 'RolePlaying' : d.genre]};}), genreColor(d.genre))});


    update.platform(pd);
    update.area(ad);
    update.genre(gd);
}

function btnArea() {
    d3.select('.histogram').node().innerHTML = "";

    hd = fd_area.map((d) => {return {area: d.area, sale: d.sale}});
    pd = PLATFORM.map((d) => {
        return {name: d.name, sale: d3.sum(fd_area.map((e) => {
            return e.platform[d.name]}))}});
    ad = AREA.map((d) => {
        return {area: d, sale: fd_area.find((e) => {
            return e.area == d}).sale}});
    gd = GENRE.map((d) => {
        return {genre: d, sale: d3.sum(fd_area.map((e) => {
            return e.genre[d == 'Role-Playing' ? 'RolePlaying' : d]}))}});

    const svg  = d3.select('.histogram').append('svg');
    const rect = svg.node().getBoundingClientRect();
    const m    = {
        top:    30,
        right:  30,
        bottom: 30,
        left:   30
    };

    svg.append('text')
        .text('(單位:百萬份/地區)')
        .attr('x', '10')
        .attr('y', '20')
        .style('fill', '#d0b0b0')
        .style('font-size', '20px')
        .style('font-weight', 'bold')
        .style('font-family', 'Courier New');

    var x = d3.scale.ordinal()
        .domain(hd.map((d) => {return d.area;}))
        .rangeRoundBands([0, rect.width - m.left - m.right], 0.1);

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + m.left + ', ' + (rect.height - m.bottom) + ')')
        .call(d3.svg.axis().scale(x).orient('bottom'));

    var y = d3.scale.linear()
        .domain([0, d3.max(hd, (d) => {return d.sale;})])
        .range([rect.height - m.top - m.bottom, 0]);

    var bars = svg.selectAll('.bar')
        .data(hd)
        .enter().append('g')
            .attr('class', 'bar')
            .attr('transform', 'translate(' + m.left + ', ' + m.top + ')')
            .on('mouseover', (d) => {
                var p = PLATFORM.map((e) => {
                    return {name: e.name, sale: fd_area.find((f) => {
                        return f.area == d.area}).platform[e.name]}});

                var a = ad;

                var g = GENRE.map((e) => {
                    return {genre: e, sale: fd_area.find((f) => {
                        return f.area == d.area}).genre[e == 'Role-Playing' ? 'RolePlaying' : e]}});

                update.platform(p);
                update.area(a);
                update.genre(g);
            })
            .on('mouseout', function(d) {
                update.platform(pd);
                update.area(ad);
                update.genre(gd);
            });

    bars.append('rect')
        .attr('x', (d) => {return x(d.area);})
        .attr('y', (d) => {return rect.height - m.top - m.bottom;})
        .attr('width', x.rangeBand())
        .attr('height', '0')
        .attr('fill', 'steelblue');

    bars.append('text')
        .text((d) => {return d.sale.toFixed(0);})
        .attr('x', (d) => {return x(d.area) + x.rangeBand() / 2;})
        .attr('y', (d) => {return rect.height - m.top - m.bottom - 5;})
        .attr('text-anchor', 'middle');

    bars = d3.selectAll('.bar');

    bars.select('rect')
        .transition().duration(500)
        .attr('y', (d) => {return y(d.sale);})
        .attr('height', (d) => {return rect.height - m.top - m.bottom - y(d.sale);})

    bars.select('text')
        .transition().duration(500)
        .attr('y', (d) => {return y(d.sale) - 5;});

    update.histogram = function (data, color) {
        y.domain([0, d3.max(data, (d) => {return d.sale;})]);

        var bars = d3.selectAll('.bar').data(data);

        bars.select('rect')
            .transition().duration(500)
            .attr('y', (d) => {return y(d.sale);})
            .attr('height', (d) => {return rect.height - m.top - m.bottom - y(d.sale);})
            .attr('fill', color);

        bars.select('text')
            .text((d) => {return d.sale.toFixed(0);})
            .transition().duration(500)
            .attr('y', (d) => {return y(d.sale) - 5;});
    };

    d3.select('.platform .pie').selectAll('path')
        .on('mouseover', function(d) {
            update.histogram(fd_area.map(function(e) {
                return {area: e.area, sale: e.platform[d.data.name]};}), platformColor(d.data.name));});

    d3.select('.area .pie').selectAll('path')
        .on('mouseover', function(d) {});

    d3.select('.genre .pie').selectAll('path')
        .on('mouseover', function(d) {
            update.histogram(fd_area.map(function(e) {
                return {area: e.area, sale: e.genre[d.data.genre == 'Role-Playing' ? 'RolePlaying' : d.data.genre]};}), genreColor(d.data.genre))});

    d3.select('.platform .legend').selectAll('g').select('rect')
        .on('mouseover', function(d) {
            update.histogram(fd_area.map(function(e) {
                return {area: e.area, sale: e.platform[d.name]};}), platformColor(d.name));});

    d3.select('.area .legend').selectAll('g').select('rect')
        .on('mouseover', function(d) {});

    d3.select('.genre .legend').selectAll('g').select('rect')
        .on('mouseover', function(d) {
            update.histogram(fd_area.map(function(e) {
                return {area: e.area, sale: e.genre[d.genre == 'Role-Playing' ? 'RolePlaying' : d.genre]};}), genreColor(d.data.genre))});

    update.platform(pd);
    update.area(ad);
    update.genre(gd);
}

function btnGenre() {
    d3.select('.histogram').node().innerHTML = "";

    hd = fd_genre.map((d) => {return {genre: d.genre, sale: d.sale}});
    pd = PLATFORM.map((d) => {
        return {name: d.name, sale: d3.sum(fd_genre.map((e) => {
            return e.platform[d.name]}))}});
    ad = AREA.map((d) => {
        return {area: d, sale: d3.sum(fd_genre.map((e) => {
            return e.area[d]}))}});
    gd = GENRE.map((d) => {
        return {genre: d, sale: fd_genre.find((e) => {
            return e.genre == (d == 'Role-Playing' ? 'RolePlaying' : d)}).sale}});

    const svg  = d3.select('.histogram').append('svg');
    const rect = svg.node().getBoundingClientRect();
    const m    = {
        top:    30,
        right:  30,
        bottom: 30,
        left:   30
    };

    svg.append('text')
        .text('(單位:百萬份/類型)')
        .attr('x', '10')
        .attr('y', '20')
        .style('fill', '#d0b0b0')
        .style('font-size', '20px')
        .style('font-weight', 'bold')
        .style('font-family', 'Courier New');

    var x = d3.scale.ordinal()
        .domain(hd.map((d) => {return d.genre;}))
        .rangeRoundBands([0, rect.width - m.left - m.right], 0.1);

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + m.left + ', ' + (rect.height - m.bottom) + ')')
        .call(d3.svg.axis().scale(x).orient('bottom'));

    var y = d3.scale.linear()
        .domain([0, d3.max(hd, (d) => {return d.sale;})])
        .range([rect.height - m.top - m.bottom, 0]);

    var bars = svg.selectAll('.bar')
        .data(hd)
        .enter().append('g')
            .attr('class', 'bar')
            .attr('transform', 'translate(' + m.left + ', ' + m.top + ')')
            .on('mouseover', (d) => {
                var p = PLATFORM.map((e) => {
                    return {name: e.name, sale: fd_genre.find((f) => {
                        return f.genre == d.genre}).platform[e.name]}});

                var a = AREA.map((e) => {
                    return {area: e, sale: fd_genre.find((f) => {
                        return f.genre == d.genre}).area[e]}});

                var g = gd;

                update.platform(p);
                update.area(a);
                update.genre(g);
            })
            .on('mouseout', function(d) {
                update.platform(pd);
                update.area(ad);
                update.genre(gd);
            });

    bars.append('rect')
        .attr('x', (d) => {return x(d.genre);})
        .attr('y', (d) => {return rect.height - m.top - m.bottom;})
        .attr('width', x.rangeBand())
        .attr('height', '0')
        .attr('fill', 'steelblue');

    bars.append('text')
        .text((d) => {return d.sale.toFixed(0);})
        .attr('x', (d) => {return x(d.genre) + x.rangeBand() / 2;})
        .attr('y', (d) => {return rect.height - m.top - m.bottom - 5;})
        .attr('text-anchor', 'middle');

    bars = d3.selectAll('.bar');

    bars.select('rect')
        .transition().duration(500)
        .attr('y', (d) => {return y(d.sale);})
        .attr('height', (d) => {return rect.height - m.top - m.bottom - y(d.sale);})

    bars.select('text')
        .transition().duration(500)
        .attr('y', (d) => {return y(d.sale) - 5;});

    update.histogram = function (data, color) {
        y.domain([0, d3.max(data, (d) => {return d.sale;})]);

        var bars = d3.selectAll('.bar').data(data);

        bars.select('rect')
            .transition().duration(500)
            .attr('y', (d) => {return y(d.sale);})
            .attr('height', (d) => {return rect.height - m.top - m.bottom - y(d.sale);})
            .attr('fill', color);

        bars.select('text')
            .text((d) => {return d.sale.toFixed(0);})
            .transition().duration(500)
            .attr('y', (d) => {return y(d.sale) - 5;});
    };

    d3.select('.platform .pie').selectAll('path')
        .on('mouseover', function(d) {
            update.histogram(fd_genre.map(function(e) {
                return {genre: e.genre, sale: e.platform[d.data.name]};}), platformColor(d.data.name));});

    d3.select('.area .pie').selectAll('path')
        .on('mouseover', function(d) {
            update.histogram(fd_genre.map(function(e) {
                return {genre: e.genre, sale: e.area[d.data.area]};}), areaColor(d.data.area))});

    d3.select('.genre .pie').selectAll('path')
        .on('mouseover', function(d) {});

    d3.select('.platform .legend').selectAll('g').select('rect')
        .on('mouseover', function(d) {
            update.histogram(fd_genre.map(function(e) {
                return {genre: e.genre, sale: e.platform[d.name]};}), platformColor(d.name));});

    d3.select('.area .legend').selectAll('g').select('rect')
        .on('mouseover', function(d) {
            update.histogram(fd_genre.map(function(e) {
                return {genre: e.genre, sale: e.area[d.area]};}), areaColor(d.area))});

    d3.select('.genre .legend').selectAll('g').select('rect')
        .on('mouseover', function(d) {});

    update.platform(pd);
    update.area(ad);
    update.genre(gd);
}

function newData() {
    var data = {
        Year:         prompt('Year:'),
        Global_Sales: prompt('Global_Sales:'),
        Platform:     prompt('Platform:'),
        NA_Sales:     prompt('NA_Sales:'),
        EU_Sales:     prompt('EU_Sales:'),
        JP_Sales:     prompt('JP_Sales:'),
        Other_Sales:  prompt('Other_Sales:'),
        Genre:        prompt('Genre:')
    };

    data.Year         = Number.isInteger(Number(data.Year)) && fd_year.map((d) => {return d.year}).some((d) => {return d == data.Year}) ? data.Year : Number(1980);
    data.Global_Sales = Number.isInteger(Number(data.Global_Sales)) ? data.Global_Sales : Number(0);
    data.Platform     =
        PLATFORM[0].member.some((d) => {return d == data.Platform}) ||
        PLATFORM[1].member.some((d) => {return d == data.Platform}) ||
        PLATFORM[2].member.some((d) => {return d == data.Platform}) ||
        PLATFORM[3].member.some((d) => {return d == data.Platform}) ?
        data.Platform : PLATFORM[3].member[0];
    data.NA_Sales     = Number.isInteger(Number(data.NA_Sales)) ? data.NA_Sales : Number(0);
    data.EU_Sales     = Number.isInteger(Number(data.EU_Sales)) ? data.EU_Sales : Number(0);
    data.JP_Sales     = Number.isInteger(Number(data.JP_Sales)) ? data.JP_Sales : Number(0);
    data.Other_Sales  = Number.isInteger(Number(data.Other_Sales)) ? data.Other_Sales : Number(0);
    data.Genre        = GENRE.some((d) => {return d == data.Genre}) ? data.Genre : GENRE[0];

    addData(data);
    fd_year.sort((a, b) => {return a.year - b.year});

    btnYear();
}
