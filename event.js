(function() {
    // Constants
    var PROJECT_TYPES = { NODEJS: 1, BROWSER: 2 };
    var CUR_PAGE;

    function getTemplate(parentID) {
        var template = $('#' + parentID + '>:first-child');

        if (template.hasClass('Template')) {
            template.removeClass('Template');
            template.remove();
        }

        return template;
    }

    function ProcessData() {
        var data = ToolsJS.RawData[String(ToolsJS.Project.Type.Type)];
        ToolsJS.Data.Items = data;

        var item;
        for (var i = 0; i < data.length; i++) {
            item = data[i];
            
            var type = item.type;

            // Populate lists
            if (ToolsJS.Data.types.indexOf(item.type) === -1) {
                ToolsJS.Data.types.push(item.type);
            }
        }
    }

    function GenerateScreen() {
        // Generate filters
        var filter_type = getTemplate("Type-Filter");
        for (var i = 0; i < ToolsJS.Data.types.length; i++) {
            $("#Type-Filter").append(filter_type.clone().html(ToolsJS.Data.types[i]));
        }

        // Update grid
        var grid_item = getTemplate("Body");
        var it;
        var ci;

        for (var i = 0; i < ToolsJS.Data.Items.length; i++) {
            it = grid_item.clone();
            ci = ToolsJS.Data.Items[i];

            if (ci.links && ci.links.logo) {
                it.find('[data-id=title]').html('<img src=\"./assets/logo/' + ToolsJS.Data.Items[i].links.logo + '\"/>')
            } else {
                it.find('[data-id=title]').html('<h1>'+ci.name+'</h1>')
            }

            it.find('[data-id=desc]').html(ci.desc || "");

            it.attr('data-entryid', i);

            $("#Body").append(it);
        }
    }

    var ToolsJS = {
        Project: {
            Name: "My Project",
            Desc: "My Project",
            Type: { Type: null, Image: null }
        },

        Data: {
            types: []
        },

        set: {
            Type: function(type, img, name) {
                ToolsJS.Project.Type = { Type: type, Image: img, Name: name };
                ProcessData();
                GenerateScreen();
            },

            Screen: function(name) {
                var self = $("#Page-" + name);
                self.css('display', 'none');
                self.removeClass("Hidden");
                self.fadeIn(100);
                
                $(".Page").not(self).not('#' + CUR_PAGE).hide();
                $(".Page").not(self).addClass("Hidden").fadeOut(100);

                CUR_PAGE = "Page-" + name;
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
                var name = $("#P-Name").val().trim();
                var desc = $("#P-Desc").val().trim();

                if (name) {
                    ToolsJS.Project.Name = name;
                    $(".Proj-Title").html(name);
                    $("#P-Name").removeClass("error");
                } else {
                    $("#P-Name").addClass("error");
                }

                if (desc) {
                    ToolsJS.Project.Desc = desc;
                    $("#P-Desc").removeClass("error");
                } else {
                    $("#P-Desc").addClass("error");
                }

                if (name && desc) {
                    ToolsJS.set.Screen("Module");
                }
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
        // Set current page
        CUR_PAGE = $(".Page").first().attr('id');

        // Get data.json
        $.ajax({
            type: 'GET',
            url: './data.json',
            dataType: 'json',

            success: function(data) {
                ToolsJS.RawData = data;
                ToolsJS.set.Screen("Welcome");
            },

            error: function(data) {
                var code = data.status || 404;
                $(".Error-Code").html(code);
                ToolsJS.set.Screen("Error");
            }
        });

        for (var i = 0; i < ToolsJS.event.length; i++) {
            var data = ToolsJS.event[i];
            $(data[0]).on(data[1], data[2]);
        }
    };

    if (!window.ToolsJS)
        window.ToolsJS = ToolsJS;
}());
