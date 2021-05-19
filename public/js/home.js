(function($) {
    //set up needed variables
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
    
    /**
     * Triggers when the light mode button is clicked
     * Changes elements to look light
     */
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

    /**
     * Triggers when the dark mode button is clicked
     * Changes elements to look dark
     */
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

    /**
     * Sets the direction variable to the correct value based on the class of the buttons
     */
    const calcDirection = () => {
        if(rl.hasClass("btn-secondary") || rl.hasClass("btn-light")) {
            direction = "rl";
        }
        else if(lr.hasClass("btn-secondary") || lr.hasClass("btn-light")) {
            direction = "lr";
        }
    }

    /**
     * Calculates the maximum decimal value that can be achieved by the bits
     * Sets the classes of the maximum buttons accordingly
     * Used whenever the number of bits are changed
     */
    const updateMaxValue = () => {
        //Calculate maximum value
        let max = 0;
        let inputs = $('input[name="binaryInput"]');
        inputs.each(() => max++);
        max = Math.pow(2, max);
        //Update all maxmimum value buttons
        if(mode == "light") $('button[name="maxValue"]').attr("class", "btn btn-outline-secondary");
        else if(mode == "dark") $('button[name="maxValue"]').attr("class", "btn btn-outline-light");
        //Update correct maximum value button to differentiate it from other buttons
        $('button[name="maxValue"]').each((index, element) => {
            if($(element).html() == max-1) {
                if(mode == "light") $(element).attr("class", "btn btn-secondary");
                else if(mode == "dark") $(element).attr("class", "btn btn-light");
            }
        });
    }

    /**
     * Updates the value of the binary inputs to 0 or 1 based on the decimal value
     * Triggers when the decimal value is changed
     */
    const updateBinaryInputs = () => {
        let inputs = $('input[name="binaryInput"]');
        //make sure direction is correct
        calcDirection();
        let total = 0;
        //reset all binary input values to 0
        inputs.each((index) => {
            $($(`input[name="binaryInput"]`)[index]).val(0);
        })
        //update binary input values to reach the correct decimal number
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

    /**
     * Calculates the decimal value of the binary inputs and adjusts the decimal input accordingly
     * Triggers when the binary inputs are changed
     */
    const updateDecimalInput = () => {
        let inputs = $('input[name="binaryInput"]');
        //error check binary inputs
        inputs.each((index, element) => {
            if($(element).val() > 1) {
                $(element).val(1);
            }
            else if($(element).val() < 0) {
                $(element).val(0);
            }
        });
        //make sure direction is updated
        calcDirection();
        let total = 0;
        //calculate decimal value
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
    
    /**
     * Checks the decimal does not exceed the current maximum value or go lower than zero, then updates binary inputs
     * Triggers when the decimal value is changed
     */
    let checkDecimal = () => {
        if(decimal.val() < 0) {
            decimal.val(0);
        }
        else {
            //calculate max
            let max = 0;
            let inputs = $('input[name="binaryInput"]');
            inputs.each(() => max++);
            max = Math.pow(2, max);
            //check against max 
            if(decimal.val() >= max-1) {
                decimal.val(max-1);
            }
        }
        updateBinaryInputs();
    }

    /**
     * Run checkDecimal() when the value of the decimal input is changed
     */
    decimal.change(() => checkDecimal());

    /**
     * Subtract the value of the decimal by one
     * Triggers when the minus button is clicked
     */
    minus.click(() => { 
        decimal.val(parseInt(decimal.val()) - 1);
        checkDecimal();
    });

    /**
     * Add one to the value of the decimal
     * Triggers when the plus button is clicked
     */
    plus.click(() => {
        decimal.val(parseInt(decimal.val()) + 1);
        checkDecimal();
    });

    /**
     * Makes sure the correct amount of binary inputs exist
     * Triggers when the value of bits or bytes is changed
     */
    const changeBits = () => {
        binaryInputs = $('#binaryInputs');
        let inputs = $('input[name="binaryInput"]');
        //make sure direction is correct
        calcDirection();
        //error check bits
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
        //bits has changed, add or subtract inputs to the correct side (left or right)
        while(bits.val() != oldBits) {
            inputs = $('input[name="binaryInput"]');
            if(direction == "rl" && bits.val() > oldBits) {
                //add input to the left (largest value)
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
                //remove input from the left (largest value)
                inputs.first().remove();
                oldBits--;
            }
            else if(direction == "lr" && bits.val() > oldBits) {
                //add input to the right (largest value)
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
                //remove input from the right (largest value)
                inputs.last().remove();
                oldBits--;
            }
            //update value of bytes
            bytes.val(parseInt(bits.val() / 8));
            oldBytes = bytes.val();
        }
        //update maximum value buttons
        updateMaxValue();
    }

    /**
     * run changeBits() when the value of the bits input changes
     */
    bits.change(changeBits);

    /**
     * Error checks the value of the bytes input and adjusts the bites accordingly
     * Triggers when the value of the bytes input changes
     */
    bytes.change(() => {
        let bitsValue = parseInt(bits.val());
        //no negative bytes
        if(bytes.val() < 0) {
            oldBytes = 0;
            bytes.val(0);
            return;
        }
        //update bytes
        if(bytes.val() > oldBytes) {
            bits.val(bitsValue + 8);
        }
        else if(bytes.val() < oldBytes) {
            bits.val(bitsValue - 8);
        }
        oldBytes = bytes.val();
        //update bits
        changeBits();
    });

    /**
     * Updates the classes of the Right -> Left and Left -> Right buttons and the local direction
     * @param {String} value either lr or rl which will indicate how to change the direction 
     * Triggered when the Right -> Left or Left -> Right buttons are clicked
     */
    const updateLRRL = (value) => {
        //Left -> Right clicked
        if(value == "lr" && direction != "lr") {
            if(mode == "light") {
                lr.attr("class", "btn btn-secondary w-50");
                rl.attr("class", "btn btn-outline-secondary w-50");
            }
            else if(mode == "dark") {
                lr.attr("class", "btn btn-light w-50");
                rl.attr("class", "btn btn-outline-light w-50");
            }
        }   
        //Right -> Left clicked
        else if(value == "rl" && direction != "rl") {
            if(mode == "light") {
                lr.attr("class", "btn btn-outline-secondary w-50");
                rl.attr("class", "btn btn-secondary w-50");
            }
            if(mode == "dark") {
                lr.attr("class", "btn btn-outline-light w-50");
                rl.attr("class", "btn btn-light w-50");
            }
        } 
        //update direction
        calcDirection();
        //update decimal based on the new binary value
        updateDecimalInput();
    }

    /**
     * run updateLRRL() with the correct value when the Left -> Right or Right -> Left buttons are clicked
     */
    lr.click(() => updateLRRL("lr"));
    rl.click(() => updateLRRL("rl"));

    /**
     * Updates the class of the maximum value buttons and updates the bits and bytes accordingly
     * @param {event} event the jquery click() event
     * Triggers when one of the maximum value buttons are pressed
     */
    const changeMaxValue = (event) => {
        //Update classes of maximum value buttons
        if(mode == "light") {
            $('button[name="maxValue"]').attr("class", "btn btn-outline-secondary");
            $(event.currentTarget).attr("class", "btn btn-secondary");
        }
        else if(mode == "dark") {
            $('button[name="maxValue"]').attr("class", "btn btn-outline-light");
            $(event.currentTarget).attr("class", "btn btn-light");
        }
        //Calculate amount of bits
        let total = parseInt($(event.currentTarget).html());
        let x = 0;
        while (total > 0) {
            total = total - Math.pow(2, x);
            x++;
        }
        //Change value of bits
        bits.val(x);
        //Change number of inputs and value of bytes accordingly
        changeBits();
    }

    /**
     * Adds the initial amount of binary inputs to the page and adds the click event to the maximum value buttons
     * Triggers when the jquery finishes loading
     */
    const initialize = () => {
        //add initial binary inputs
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
        //add click event to maximum value buttons
        $('button[name="maxValue"]').click((event) => changeMaxValue(event));
    }

    /**
     * run initialize() when the jquery code loads
     */
    initialize();
})(window.jQuery);