var compile = function (musexpr, time) {
    time = time || [0];
    if (musexpr.tag == 'note') {
        t = time[0];
        time[0] += musexpr.dur;
        return [{ tag: 'note',
                  pitch: musexpr.pitch,
                  start: t,
                  dur: musexpr.dur }];
    }
    else if (musexpr.tag == 'rest') {
        time[0] += musexpr.dur;
        return [];
    }
    else if (musexpr.tag == 'par') {
        t = [time[0]];
        var r = compile(musexpr.left,t).concat(compile(musexpr.right,time));
        if (t[0] > time[0])
            time[0] = t[0];
        return r;
    }
    else if (musexpr.tag == 'seq') {
        return compile(musexpr.left,time).concat(compile(musexpr.right,time));
    }
};

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));