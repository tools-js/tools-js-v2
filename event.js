(function() {
    // Constants
    var PROJECT_TYPES = { NODEJS: 1, BROWSER: 2 };

    var ToolsJS = {
        Project: {
            Type: null
        },

        set: {
            Type: function(type, img) {
                ToolsJS.Project.Type = { Type: type, Image: img };
            },

            Screen: function(name) {
                var self = $("#Page-" + name);
                self.css('display', 'none');
                self.removeClass("Hidden");
                self.fadeIn(100);
                
                $(".Page").not(self).addClass("Hidden").fadeOut(100);
            }
        },

        event: [
            // Scroll event
            [ '.transition', 'click', function() {
                var targetScroll = this.dataset.target;
                if (!targetScroll)
                    throw new TypeError("`data-target` attribute not present on scroll item");

                ToolsJS.set.Screen(targetScroll);
            } ],

            // Selected Project type
            ['#TypeSelect > .choice', 'click', function() {
                var projectType = PROJECT_TYPES[$(this).data('pt')];
                var img = $(this).attr('src');

                if (!projectType)
                    throw new TypeError("`data-pt` must be a valid project type identifier.");
                
                // Set project type
                ToolsJS.set.Type(projectType, img);
            } ]
        ]
    };

    // Dispatch events
    window.onload = function() {
        for (var i = 0; i < ToolsJS.event.length; i++) {
            var data = ToolsJS.event[i];
            $(data[0]).on(data[1], data[2]);
        }
    };

    if (!window.ToolsJS)
        window.ToolsJS = ToolsJS;
}());
