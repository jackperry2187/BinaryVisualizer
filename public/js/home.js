(function($) {
    let bits = $('#bits');
    let bytes = $('#bytes');
    let binaryInputs = $('#binaryInputs');
    let direction = $('input[name="direction"]:checked');
    let decimal = $('#decimal');
    let plus = $('#plus');
    let minus = $('#minus');
    let oldBits = 4;
    
    function initialize() {
        for(let x = 0; x < bits.val(); x++) {
            $('<input>')
            .attr({
                type: 'number',
                name: "binaryInput",
                value: 0,
                placeholder: 0,
            })
            .appendTo(binaryInputs);
        }
    }

    bits.change(function() {
        binaryInputs = $('#binaryInputs');
        direction = $('input[name="direction"]:checked');
        if(direction.val() == "rl" && bits.val() > oldBits) {
            $('<input>')
            .attr({
                type: 'number',
                name: "binaryInput",
                value: 0,
                placeholder: 0,
            })
            .prependTo(binaryInputs);
        }
        else if(direction.val() == "rl" && bits.val() < oldBits) {
            binaryInputs.children().first().remove();
        }
        else if(direction.val() == "lr" && bits.val() > oldBits) {
            $('<input>')
            .attr({
                type: 'number',
                name: "binaryInput",
                value: 0,
                placeholder: 0,
            })
            .appendTo(binaryInputs);
        }
        else if(direction.val() == "lr" && bits.val() < oldBits) {
            binaryInputs.children().last().remove();
        }
        oldBits = bits.val();
    });

    initialize();
})(window.jQuery);