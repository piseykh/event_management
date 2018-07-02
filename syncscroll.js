
/**
 * @fileoverview syncscroll - scroll several areas simultaniously
 * @version 0.0.3
 * 
 * @license MIT, see http://github.com/asvd/intence
 * @copyright 2015 asvd <heliosframework@gmail.com> 
 */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.syncscroll = {}));
    }
}(this,function (exports) {
    var Width = 'Width';
    var Height = 'Height';
    var Top = 'Top';
    var Left = 'Left';
    var scroll = 'scroll';
    var client = 'client';
    var EventListener = 'EventListener';
    var addEventListener = 'add' + EventListener;
    var length = 'length';
    var Math_round = Math.round;

    var names = {};

    var reset = function() {
        var elems = document.getElementsByClassName('sync'+scroll);

        // clearing existing listeners
        var i, j, el, found, name;
        for (name in names) {
            if (names.hasOwnProperty(name)) {
                for (i = 0; i < names[name][length]; i++) {
                    names[name][i]['remove'+EventListener](
                        scroll, names[name][i].syn, 0
                    );
                }
            }
        }

        // setting-up the new listeners
        for (i = 0; i < elems[length];) {
            found = j = 0;
            el = elems[i++];
            if (!(name = el.getAttribute('name'))) {
                // name attribute is not set
                continue;
            }

            el = el[scroll+'er']||el;  // needed for intence

            // searching for existing entry in array of names;
            // searching for the element in that entry
            for (;j < (names[name] = names[name]||[])[length];) {
                found |= names[name][j++] == el;
            }

            if (!found) {
                names[name].push(el);
            }

            el.eX = el.eY = 0;

            (function(el, name) {
                el[addEventListener](
                    scroll,
                    el.syn = function() {
                        var elems = names[name];

                        var scrollX = el[scroll+Left];
                        var scrollY = el[scroll+Top];

                        var xRate =
                            scrollX /
                            (el[scroll+Width] - el[client+Width]);
                        var yRate =
                            scrollY /
                            (el[scroll+Height] - el[client+Height]);

                        var updateX = scrollX != el.eX;
                        var updateY = scrollY != el.eY;

                        var otherEl, i = 0;

                        el.eX = scrollX;
                        el.eY = scrollY;

                        for (;i < elems[length];) {
                            otherEl = elems[i++];
                            if (otherEl != el) {
                                if (updateX &&
                                    Math_round(
                                        otherEl[scroll+Left] -
                                        (scrollX = otherEl.eX =
                                         Math_round(xRate *
                                             (otherEl[scroll+Width] -
                                              otherEl[client+Width]))
                                        )
                                    )
                                ) {
                                    otherEl[scroll+Left] = scrollX;
                                }
                                
                                if (updateY &&
                                    Math_round(
                                        otherEl[scroll+Top] -
                                        (scrollY = otherEl.eY =
                                         Math_round(yRate *
                                             (otherEl[scroll+Height] -
                                              otherEl[client+Height]))
                                        )
                                    )
                                ) {
                                    otherEl[scroll+Top] = scrollY;
                                }
                            }
                        }
                    }, 0
                );
            })(el, name);
        }
    }
    
       
    if (document.readyState == "complete") {
        reset();
    } else {
        window[addEventListener]("load", reset, 0);
    }

    exports.reset = reset;
}));


=======
!function(e,n){"function"==typeof define&&define.amd?define(["exports"],n):n("undefined"!=typeof exports?exports:e.syncscroll={})}(this,function(e){var n="Width",t="Height",o="Top",r="Left",f="scroll",i="client",s="EventListener",d="add"+s,c="length",a=Math.round,u={},l=function(){var e,l,p,y,m,h=document.getElementsByClassName("sync"+f);for(m in u)if(u.hasOwnProperty(m))for(e=0;e<u[m][c];e++)u[m][e]["remove"+s](f,u[m][e].syn,0);for(e=0;e<h[c];)if(y=l=0,p=h[e++],m=p.getAttribute("name")){for(p=p[f+"er"]||p;l<(u[m]=u[m]||[])[c];)y|=u[m][l++]==p;y||u[m].push(p),p.eX=p.eY=0,function(e,s){e[d](f,e.syn=function(){var d,l=u[s],p=e[f+r],y=e[f+o],m=p/(e[f+n]-e[i+n]),h=y/(e[f+t]-e[i+t]),v=p!=e.eX,g=y!=e.eY,X=0;for(e.eX=p,e.eY=y;X<l[c];)d=l[X++],d!=e&&(v&&a(d[f+r]-(p=d.eX=a(m*(d[f+n]-d[i+n]))))&&(d[f+r]=p),g&&a(d[f+o]-(y=d.eY=a(h*(d[f+t]-d[i+t]))))&&(d[f+o]=y))},0)}(p,m)}};"complete"==document.readyState?l():window[d]("load",l,0),e.reset=l});
>>>>>>> 1a6600d480627e8eca10075ac211a69ec18ddefe
