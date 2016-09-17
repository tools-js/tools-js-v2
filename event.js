(function() {
    // Constants
    var PROJECT_TYPES = { NODEJS: 1, BROWSER: 2 };

    var ToolsJS = {
        Project: {
            Name: "My Project",
            Description: "My Project",
            Type: { Type: null, Image: null }
        },

        set: {
            Type: function(type, img, name) {
                ToolsJS.Project.Type = { Type: type, Image: img, Name: name };
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
            // Change screen event
            [ '.transition', 'click', function() {
                var targetScroll = this.dataset.target;
                if (!targetScroll)
                    throw new TypeError("`data-target` attribute not present on scroll item");

                ToolsJS.set.Screen(targetScroll);
            } ],

            // Update name/desc
            [ '#SubmitDetails', 'click', function() {
                var name = $("#P-Name").val();
                var desc = $("#P-Desc").val();

                ToolsJS.Project.Name = name;
                ToolsJS.Project.Desc = desc;
            } ],

            // Selected Project type
            ['#TypeSelect > .choice', 'click', function() {
                var projectType = PROJECT_TYPES[$(this).data('pt')];
                var img = $(this).find('img').attr('src');
                var name = $(this).find('span').text();

                if (!projectType)
                    throw new TypeError("`data-pt` must be a valid project type identifier.");
                
                $(".Type-Image").attr('src', img);
                $(".Type-TypeName").html(name);

                // Set project type
                ToolsJS.set.Type(projectType, img, name);
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
