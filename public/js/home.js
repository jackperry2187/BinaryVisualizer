(function($) {
    let bits = $('#bits');
    let bytes = $('#bytes');
    let binaryInputs = $('#binaryInputs');
    let direction = $('input[name="direction"]:checked');
    let decimal = $('#decimal');
    let plus = $('#plus');
    let minus = $('#minus');
    let oldBits = 4;
    let oldBytes = 0;
    
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

    const changeBits = () => {
        binaryInputs = $('#binaryInputs');
        direction = $('input[name="direction"]:checked');
        if(bits.val() < 1) {
            oldBits = 1;
            bits.val(1);
            binaryInputs.empty().append(
                $('<input>')
                .attr({
                    type: 'number',
                    name: "binaryInput",
                    value: 0,
                    placeholder: 0,
                })
            );
        }
        while(bits.val() != oldBits) {
            if(direction.val() == "rl" && bits.val() > oldBits) {
                $('<input>')
                .attr({
                    type: 'number',
                    name: "binaryInput",
                    value: 0,
                    placeholder: 0,
                })
                .prependTo(binaryInputs);
                oldBits++;
            }
            else if(direction.val() == "rl" && bits.val() < oldBits) {
                binaryInputs.children().first().remove();
                oldBits--;
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
                oldBits++;
            }
            else if(direction.val() == "lr" && bits.val() < oldBits) {
                binaryInputs.children().last().remove();
                oldBits--;
            }
            bytes.val(parseInt(bits.val() / 8));
            oldBytes = bytes.val();
        }
    }

    bits.change(changeBits);

    bytes.change(() => {
        let bitsValue = parseInt(bits.val());
        if(bytes.val() < 0) {
            oldBytes = 0;
            bytes.val(0);
            return;
        }
        if(bytes.val() > oldBytes) {
            bits.val(bitsValue + 8);
        }
        else if(bytes.val() < oldBytes) {
            bits.val(bitsValue - 8);
        }
        oldBytes = bytes.val();
        changeBits();
    });

    initialize();
})(window.jQuery);