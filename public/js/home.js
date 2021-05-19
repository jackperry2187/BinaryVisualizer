(function($) {
    let bits = $('#bits');
    let bytes = $('#bytes');
    let binaryInputs = $('#binaryInputs');
    let rl = $('#rl');
    let lr = $('#lr');
    let minus = $('#minus');
    let decimal = $('#decimal');
    let plus = $('#plus');
    
    let oldBits = 4;
    let oldBytes = 0;
    let direction;
    
    const initialize = () => {
        for(let x = 0; x < bits.val(); x++) {
            $('<input>')
            .attr({
                type: 'number',
                name: "binaryInput",
                value: 0,
                placeholder: 0,
                class: "form-control"
            })
            .appendTo(binaryInputs);
        }
    }

    const calcDirection = () => {
        if(rl.hasClass("btn-secondary")) {
            direction = "rl";
        }
        else if(lr.hasClass("btn-secondary")) {
            direction = "lr";
        }
    }

    const changeBits = () => {
        binaryInputs = $('#binaryInputs');
        let inputs = $('input[name="binaryInput"]');
        calcDirection();
        if(bits.val() < 1) {
            oldBits = 1;
            bits.val(1);
            inputs.remove();
            $('<input>')
            .attr({
                type: 'number',
                name: "binaryInput",
                value: 0,
                placeholder: 0,
                class: "form-control"
            })
            .appendTo(binaryInputs);
        }
        while(bits.val() != oldBits) {
            inputs = $('input[name="binaryInput"]');
            if(direction == "rl" && bits.val() > oldBits) {
                $('<input>')
                .attr({
                    type: 'number',
                    name: "binaryInput",
                    value: 0,
                    placeholder: 0,
                    class: "form-control"
                })
                .insertAfter("#binaryText");
                oldBits++;
            }
            else if(direction == "rl" && bits.val() < oldBits) {
                inputs.first().remove();
                oldBits--;
            }
            else if(direction == "lr" && bits.val() > oldBits) {
                $('<input>')
                .attr({
                    type: 'number',
                    name: "binaryInput",
                    value: 0,
                    placeholder: 0,
                    class: "form-control"
                })
                .appendTo(binaryInputs);
                oldBits++;
            }
            else if(direction == "lr" && bits.val() < oldBits) {
                inputs.last().remove();
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

    const updateLRRL = (value) => {
        if(value == "lr" && direction != "lr") {
            lr.attr("class", "btn btn-secondary w-50");
            rl.attr("class", "btn btn-outline-secondary w-50");
            calcDirection();
        }   
        else if(value == "rl" && direction != "rl") {
            lr.attr("class", "btn btn-outline-secondary w-50");
            rl.attr("class", "btn btn-secondary w-50");
            calcDirection();
        } 
    }

    lr.click(() => updateLRRL("lr"));
    rl.click(() => updateLRRL("rl"));

    initialize();
})(window.jQuery);