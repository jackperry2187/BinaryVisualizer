(function($) {
    let bits = $('#bits');
    let bytes = $('#bytes');
    let binaryInputs = $('#binaryInputs');
    let rl = $('#rl');
    let lr = $('#lr');
    let minus = $('#minus');
    let decimal = $('#decimal');
    let plus = $('#plus');
    let lightMode = $('#lightMode');
    let darkMode = $('#darkMode');
    
    let oldBits = 4;
    let oldBytes = 0;
    let direction;
    let mode = "light";
    
    lightMode.click(() => {
        if(mode != "light") {
            lightMode.attr('class', 'btn btn-secondary w-50');
            darkMode.attr('class', 'btn btn-outline-secondary w-50');

            $("h1").attr('class', 'text-center display-3');
            $(".bg-dark").attr('class', 'bg-light');
            $("input[type='number']").attr('class', 'form-control');
            $("span.input-group-text").attr('class', 'input-group-text');
            $("button.btn-outline-light").attr('class', 'btn btn-outline-secondary w-50');
            $("button[name='maxValue'].btn-outline-secondary").attr('class', 'btn btn-outline-secondary');
            $("#minus").attr('class', "btn btn-outline-secondary");
            $("#plus").attr('class', "btn btn-outline-secondary");
            $("button.btn-light").attr('class', 'btn btn-secondary w-50');
            $("button[name='maxValue'].btn-secondary").attr('class', 'btn btn-secondary');
            mode = "light";
        }
    });

    darkMode.click(() => {
        if(mode != "dark") {
            lightMode.attr('class', 'btn btn-outline-secondary w-50');
            darkMode.attr('class', 'btn btn-secondary w-50');
    
            $("h1").attr('class', 'text-center display-3 text-white');
            $(".bg-light").attr('class', 'bg-dark');
            $("input[type='number']").attr('class', 'form-control bg-dark text-light');
            $("span.input-group-text").attr('class', 'input-group-text bg-light text-dark');
            $("button.btn-outline-secondary").attr('class', 'btn btn-outline-light w-50');
            $("button[name='maxValue'].btn-outline-light").attr('class', 'btn btn-outline-light');
            $("#minus").attr('class', "btn btn-outline-light");
            $("#plus").attr('class', "btn btn-outline-light");
            $("button.btn-secondary").attr('class', 'btn btn-light w-50');
            $("button[name='maxValue'].btn-light").attr('class', 'btn btn-light');
            mode = "dark";
        }
    });

    const updateMaxValue = () => {
        let max = 0;
        let inputs = $('input[name="binaryInput"]');
        inputs.each(() => max++);
        max = Math.pow(2, max);
        if(mode == "light") $('button[name="maxValue"]').attr("class", "btn btn-outline-secondary");
        else if(mode == "dark") $('button[name="maxValue"]').attr("class", "btn btn-outline-light");
        $('button[name="maxValue"]').each((index, element) => {
            if($(element).html() == max-1) {
                if(mode == "light") $(element).attr("class", "btn btn-secondary");
                else if(mode == "dark") $(element).attr("class", "btn btn-light");
            }
        });
    }

    const updateBinaryInputs = () => {
        let inputs = $('input[name="binaryInput"]');
        calcDirection();
        let total = 0;
        inputs.each((index) => {
            $($(`input[name="binaryInput"]`)[index]).val(0);
        })
        if(direction == "rl") {
            inputs.each((index) => {
                if(total == decimal.val()) return;
                let power = Math.pow(2, parseInt(bits.val())-1-index);
                if(total + power <= decimal.val()) {
                    $($(`input[name="binaryInput"]`)[index]).val(1);
                    total += power;
                }
            });
        }
        else if(direction == "lr") {
            inputs.each((index) => {
                index = parseInt(bits.val())-1-index;
                if(total == decimal.val()) return;
                let power = Math.pow(2, index);
                if(total + power <= decimal.val()) {
                    $($(`input[name="binaryInput"]`)[index]).val(1);
                    total += power;
                }
            });
        }
    }

    const updateDecimalInput = () => {
        let inputs = $('input[name="binaryInput"]');
        inputs.each((index, element) => {
            if($(element).val() > 1) {
                $(element).val(1);
            }
            else if($(element).val() < 0) {
                $(element).val(0);
            }
        });
        calcDirection();
        let total = 0;
        if(direction == "rl") {
            inputs.each((index, element) => {
                index = parseInt(bits.val())-1-index;
                let value = $(element).val();
                if(value == 1) total+= Math.pow(2, index);
            });
        }
        else if(direction == "lr") {
            inputs.each((index, element) => {
                let value = $(element).val();
                if(value == 1) total+= Math.pow(2, index);
            });
        }
        decimal.val(total);
    }
    
    let checkDecimal = () => {
        if(decimal.val() < 0) {
            decimal.val(0);
        }
        else {
            let max = 0;
            let inputs = $('input[name="binaryInput"]');
            inputs.each(() => max++);
            max = Math.pow(2, max); 
            if(decimal.val() >= max-1) {
                decimal.val(max-1);
            }
        }
        updateBinaryInputs();
    }

    decimal.change(() => checkDecimal());

    minus.click(() => { 
        decimal.val(parseInt(decimal.val()) - 1);
        checkDecimal();
    });

    plus.click(() => {
        decimal.val(parseInt(decimal.val()) + 1);
        checkDecimal();
    });

    const calcDirection = () => {
        if(rl.hasClass("btn-secondary") || rl.hasClass("btn-light")) {
            direction = "rl";
        }
        else if(lr.hasClass("btn-secondary") || lr.hasClass("btn-light")) {
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
            let input = $('<input>')
            .attr({
                type: 'number',
                name: "binaryInput",
                value: 0,
                placeholder: 0,
            })
            .appendTo(binaryInputs);
            if(mode == "light") input.attr('class', 'form-control');
            else if(mode == "dark") input.attr('class', 'form-control bg-dark text-light');
            
            input.change(() => updateDecimalInput());
        }
        while(bits.val() != oldBits) {
            inputs = $('input[name="binaryInput"]');
            if(direction == "rl" && bits.val() > oldBits) {
                let input = $('<input>')
                .attr({
                    type: 'number',
                    name: "binaryInput",
                    value: 0,
                    placeholder: 0,
                })
                .insertAfter("#binaryText");
                if(mode == "light") input.attr('class', 'form-control');
                else if(mode == "dark") input.attr('class', 'form-control bg-dark text-light');
                input.change(() => updateDecimalInput());
                oldBits++;
            }
            else if(direction == "rl" && bits.val() < oldBits) {
                inputs.first().remove();
                oldBits--;
            }
            else if(direction == "lr" && bits.val() > oldBits) {
                let input = $('<input>')
                .attr({
                    type: 'number',
                    name: "binaryInput",
                    value: 0,
                    placeholder: 0,
                })
                .appendTo(binaryInputs);
                if(mode == "light") input.attr('class', 'form-control');
                else if(mode == "dark") input.attr('class', 'form-control bg-dark text-light');
                input.change(() => updateDecimalInput());
                oldBits++;
            }
            else if(direction == "lr" && bits.val() < oldBits) {
                inputs.last().remove();
                oldBits--;
            }
            bytes.val(parseInt(bits.val() / 8));
            oldBytes = bytes.val();
        }
        updateMaxValue();
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
            if(mode == "light") {
                lr.attr("class", "btn btn-secondary w-50");
                rl.attr("class", "btn btn-outline-secondary w-50");
            }
            else if(mode == "dark") {
                lr.attr("class", "btn btn-light w-50");
                rl.attr("class", "btn btn-outline-light w-50");
            }
            
            calcDirection();
        }   
        else if(value == "rl" && direction != "rl") {
            if(mode == "light") {
                lr.attr("class", "btn btn-outline-secondary w-50");
                rl.attr("class", "btn btn-secondary w-50");
            }
            if(mode == "dark") {
                lr.attr("class", "btn btn-outline-light w-50");
                rl.attr("class", "btn btn-light w-50");
            }
            calcDirection();
        } 
        updateDecimalInput();
    }

    lr.click(() => updateLRRL("lr"));
    rl.click(() => updateLRRL("rl"));

    const changeMaxValue = (event) => {
        if(mode == "light") {
            $('button[name="maxValue"]').attr("class", "btn btn-outline-secondary");
            $(event.currentTarget).attr("class", "btn btn-secondary");
        }
        else if(mode == "dark") {
            $('button[name="maxValue"]').attr("class", "btn btn-outline-light");
            $(event.currentTarget).attr("class", "btn btn-light");
        }
        let total = parseInt($(event.currentTarget).html());
        let x = 0;
        while (total > 0) {
            total = total - Math.pow(2, x);
            x++;
        }
        bits.val(x);
        changeBits();
    }

    const initialize = () => {
        for(let x = 0; x < bits.val(); x++) {
            let input = $('<input>')
            .attr({
                type: 'number',
                name: "binaryInput",
                value: 0,
                placeholder: 0,
            })
            .appendTo(binaryInputs);
            if(mode == "light") input.attr('class', 'form-control');
            else if(mode == "dark") input.attr('class', 'form-control bg-dark text-light');
            input.change(() => updateDecimalInput());
        }
        $('button[name="maxValue"]').click((event) => changeMaxValue(event));
    }

    initialize();
})(window.jQuery);