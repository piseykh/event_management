if(!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number){
            return typeof args[number] != undefined
                ? args[number] : match;
        });
    }
}

var MIRAI;
if(!MIRAI) { MIRAI = {}; }
if(!MIRAI.main) {MIRAI.main = {};}

(function($){
    var func = MIRAI.main;

    func.fetchEventsData = function(url) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(res) {
                var response = JSON.parse(JSON.stringify(res)),
                    timetables = response.event_dates[0].timetables,
                    events = {
                        eventOn15th: [],
                        eventOn16th: []
                    };
                console.log(timetables)
                var regex = unicode_hack(/\p{N}/g),
                timeline = new Set();
                let html_border =""
                let count=0;
                timetables.map(function(ele, index){
                    var startTime = moment(ele.start).format('HH:mm'),
                        endTime = moment(ele.end).format('HH:mm'),
                        startDate = moment(ele.start).format('DD'),
                        endDate = moment(ele.end).format('DD'),
                        locationName = ele.location,
                        locationCol = $(`li.eventOn${startDate}th .table-flex[data-location="${locationName}"]`);


                    if(!locationCol.length) {

                        var locationNumbers = locationName.match(regex);

                        var roomNumber;
                        if(locationNumbers && locationNumbers.length) {
                            roomNumber = locationNumbers.join('').slice(1,locationNumbers.length);
                            locationNumbers = locationNumbers.join('').slice(0,1);
                        } else {
                            locationNumbers = '0';
                            roomNumber = '0';
                        }
                        if(roomNumber == '') {
                            roomNumber = "0";
                        }
                        var charCode = locationNumbers.charCodeAt(0),
                            codeNumber = MIRAI.main.HiraAndKataNumbers(charCode),
                            locationNumbers = codeNumber + locationNumbers.slice(1,locationNumbers.length);
                        var renderedLocationHTML = func.eventLocationColumnTemplate.format(
                            locationName,
                        );
                        renderedLocationHTML = $.parseHTML(renderedLocationHTML);
                        $(`li.eventOn${startDate}th .card-events`).append(renderedLocationHTML);

                        if(locationName.hasOwnProperty()){
                            console.log(count++)
                        }
                        var location_header = func.locationHeaderTemplate.format(
                            locationName,
                        );

                        location_header = $.parseHTML(location_header);
                        $(`li.eventOn${startDate}th .location-headers`).append(location_header);
                        //$('#background-border').append(background_border)
                    }

                    var startTimeDec = moment.duration(startTime).asHours();
                    var endTimeDec = moment.duration(endTime).asHours();
                    var timeUnitPx = 50;
                    var margin = (startTimeDec - 7) * timeUnitPx;
                    var height = (endTimeDec - startTimeDec) * timeUnitPx;

                    var orderTime = `${String(startTime).replace(':','')}${String(endTime).replace(':','')}`;




                    var renderedEventHTML = func.locationEventTemplate.format(
                        ele.name,
                        `${startTime}-${endTime}`,
                        startTime,
                        endTime,
                        String(ele.description).replace(/"/g, "&quot;"),
                        orderTime,
                        margin,
                        height
                    );
                    renderedEventHTML = $.parseHTML(renderedEventHTML);
                    $(renderedEventHTML).on('click', func.showModal);
                    $(`li.eventOn${startDate}th .table-flex[data-location="${locationName}"] .location-events`).append(
                        renderedEventHTML
                    );
                    _.extend(ele, {
                        startTime: startTime,
                        endTime: endTime
                    });
                    events[`eventOn${startDate}th`].push(ele);



                });

                for (var i = 15; i <= 16; i++) {
                    for (var j = 7; j <= 17; j++) {
                        var timelineElement = func.timelineElementTemplate.format(
                            j,
                        );
                        timelineElement = $.parseHTML(timelineElement);
                        $(`li.eventOn${i}th .time-line-item`).append(timelineElement);
                    }
                }
                let full_background =""

                for(var i=0;i<11;i++){
                    var background_border = func.backgroundBorderTemplate.format(
                    )
                    html_border = html_border + background_border;
                }
                for(var k = 0 ;k <=14;k++){
                    $('.background-border').append("<div style='width: 250px'>"+html_border+"</div>")

                }
                MIRAI.main.sortBy('data-building-number', '.schedule-wrapper', '.table-flex', 'asc', 'data-room-number');
                MIRAI.main.sortBy('data-time-order', '.location-events', '.eventRecordObject', 'asc');
                MIRAI.main.setTimelineParentHeight();
            },
            error: function(error) {
                console.log(error);
            }
        })
    }

    func.convertNumbers2English = function (string) {
        return string.replace(/[\u0660-\u0669]/g, function (c) {
            return c.charCodeAt(0) - 0x0660;
        }).replace(/[\u06f0-\u06f9]/g, function (c) {
           return c.charCodeAt(0) - 0x06f0;
       });
    }

    func.HiraAndKataNumbers = function(number){
        switch(number = parseInt(number)) {
            case 65296: return '0';
            case 65297: return '1';
            case 65298: return '2';
            case 65299: return '3';
            case 65300: return '4';
            case 65301: return '5';
            case 65302: return '6';
            case 65303: return '7';
            case 65304: return '8';
            case 65305: return '9';
            default: return String.fromCharCode(number);
        }

    }

    func.startSortingLocation = function() {
        return new Promise(function(resolve, reject){
            MIRAI.main.sortBy('data-building-number', '.schedule-wrapper', '.table-flex', 'asc', 'data-room-number');
        });
    }

    func.showModal = function() {
        var name = $(this).attr("data-name"),
            time = $(this).attr("data-time"),
            description = $(this).attr("data-description");
        $(".event-modal").css("display", "block");
        $(".cover-layer").css("visibility", "visible");
        $("body").addClass("showModal");
        $(".date").text(time);
        $(".name").text(name);
        if((description != null) && (description != undefined) && (description != "")){
            $(".body-bg").html(description);
        }else{
            $(".body-bg").text("There is no description");
        }
    }

    /**
     * @name closeModal
     */
    func.closeModal = function() {
        $(".event-modal").css("display", "none");
        $(".cover-layer").css("visibility", "hidden");
        $("body").removeClass("showModal");
    }

    /**
     * Sorting
     */
    func.sortBy = function(arg, sel, elem, order, args=null) {
        var $selector = $(sel);
        $selector.each(function(index, $sel){
            var $element = $($sel).children(elem);
            $element.sort(function(a, b) {
            var an = parseInt(a.getAttribute(arg)),
                bn = parseInt(b.getAttribute(arg));
                if (order == "asc") {
                    if (an > bn)
                    return 1;
                    if (an < bn)
                    return -1;
                } else if (order == "desc") {
                    if (an < bn)
                    return 1;
                    if (an > bn)
                    return -1;
                }
                if(args) {
                    var ann = parseInt(a.getAttribute(args)),
                        bnn = parseInt(b.getAttribute(args));
                    if (order == "asc") {
                        if (ann > bnn)
                        return 1;
                        if (ann < bnn)
                        return -1;
                    } else if (order == "desc") {
                        if (ann < bnn)
                        return 1;
                        if (ann > bnn)
                        return -1;
                    }
                }
                return 0;
            });
            $element.detach().appendTo($sel);
        });
    }

    func.setTimelineParentHeight = function(e){
        var activeCheckBox = $('.table-container input[name="tabs"]:checked');
        var parent = $(activeCheckBox).parents("li")[0];
        var wrapper = $(parent).find(".schedule-wrapper");
        if(wrapper.length){
            parent = $(parent).parents(".s-component.s-html-component");
            var height = $(wrapper[0]).height();
            $(parent[0]).css({"height": height + 250 + "px"});
        }
    }

    func.onHandleSetTimelineHeight = function(e) {
        var wrapper = $(e.currentTarget).find(".schedule-wrapper");
        if (wrapper.length){
            var parent = $(e.currentTarget).parents(".s-component.s-html-component");
            var height = $(wrapper[0]).height();
            $(parent[0]).css({"height": height + 250 + "px"});
        }
    }

    func.timelineElementTemplate = `
    <div class="timeline-element" data-time="{0}">
        <p>{0}</p>
    </div>
    `;

    func.eventLocationColumnTemplate = `
    <div class="table-flex event-card" data-location="{0}" data-building-number="{1}" data-room-number={2}>
        <div class="location-events">  
        </div>
    </div>`;

    func.locationHeaderTemplate = `
    <div class="table-flex" data-location="{0}" data-building-number="{1}" data-room-number={2}>
        <div class="col-header">
            <p>{0}</p>
        </div>
    </div>`;

    func.backgroundBorderTemplate = `<div style="height: 200px;width: 249px; display: flex;flex-direction: row;
        border: 1px solid gray;border-right:0px;border-top:0px"></div>`

    func.backgroundBorderHeigTemplate = `

        <div style="height:200px;width: 250px; display: flex;flex-direction: row;border: 1px solid black">{0}</div>`


    func.locationEventTemplate = `
    <div class="col-child eventRecordObject" style="margin-top: {6}px; height: {7}px;"
     data-name="{0}" 
     data-time="{1}" 
     data-startTime="{2}" 
     data-endTime="{3}" 
     data-description="{4}"
     data-time-order="{5}">
      <p class="time" data-time="">{1}</p>
       <br/><h4 class="name-event">{0}</h4>
   </div>`

})(jQuery);

$(document).ready(function() {

    MIRAI.main.fetchEventsData('https://api.eventregist.com/v/2/timetable/get?event_uid=3b75c6deb1a72cf894781a8c5e4f0e64');

        /**
         * @description Listen on Close element
         */
        $(".close").on("click", MIRAI.main.closeModal);

        /**
         * @description Listen on click Cover-layer
         */
        $(".cover-layer").on("click", function(e){
            if(!$(e.target).parents(".cover-layer").length > 0){
                MIRAI.main.closeModal();
            }
        });

        /**
         * @description Handle Automated Height
         */
        $(".table-container .tabs li").on("click", MIRAI.main.onHandleSetTimelineHeight);



    var timeout;

    $('.time, .schedule').on("scroll", function callback() {
        // clear the 'timeout' every 'scroll' event call
        // to prevent re-assign 'scroll' event to other element
        // before finished scrolling
        clearTimeout(timeout);

        // get the used elements
        var source = $(this),
            target = $(source.is(".time") ? '.schedule' : '.time');

        // remove the callback from the other 'div' and set the 'scrollTop'
        target.off("scroll").scrollTop(source.scrollTop());
        var border = $(".scroll-border")
        // create a new 'timeout' and reassign 'scroll' event
        // to other 'div' on 100ms after the last event call
        timeout = setTimeout(function() {
            target.on("scroll", callback);
        }, 100);
    });
    $('.scroll_time, .schedule').on("scroll", function() {
        var scrollT = $(this).scrollTop();
        let top = document.querySelector('.scroll_time').scrollHeight

            $('.scroll-border').scrollTop( scrollT );




    })
    $('.horizontal_scroll_border').on("scroll", function() {
        var scrollL = $(this).scrollLeft()
        $('.scroll-border').scrollLeft( scrollL );
    })
    const width = (window.outerWidth-16) + "px"
    $('.background-border').css({'width':"calc( "+width+" - 5%)","margin-left":"calc(5%)"})


});
