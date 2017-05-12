class Validator {
    constructor() {

    }
    static isEmail(str) {
        return (/.+@.+\..+/.test(str));
    }
    static isPhone(str) {
       return (/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(str));
    }
    static isEmpty(str) {
        return (!str || String(str).length === 0);
    }
    check(str, type) {
        if(Validator.isEmpty(str)) {
            return {
                status: false,
                message: `This value is required`,
            }
        }

        switch (type) {
            case 'email':
                return {
                    status: Validator.isEmail(str),
                    message: `Incorrect email`,
                }
            case 'phone':
                return {
                    status: Validator.isPhone(str),
                    message: `Incorrect phone number`,
                }
        }

        return {
            status: true,
            message: `You're beautiful`,
        }
    }
}

function clearValidate($field) {
    $field.removeClass('is-valid is-error');
    $field.siblings('.input__tooltip').text();
}

function updateValidatedField($field, validationResult) {
    clearValidate($field);
    if(validationResult.status) {
        $field.addClass('is-valid');
    } else {
        $field.addClass('is-error');
    }
    $field.siblings('.input__tooltip').text(validationResult.message);
}

$(()=>{
    const $body = $('body');
    const fieldForOnblurValidate = '.input__field.is-required.is-noempty';
    const validator = new Validator();
    $body.on('input', '.input__field', function(e) {
        const $this = $(this);
        if($this.val() !== '') {
            $this.addClass('is-noempty');
        } else {
            $this.removeClass('is-noempty');
            clearValidate($this);
        }
    })
    .on('change', `input${fieldForOnblurValidate}, textarea${fieldForOnblurValidate}`, function(e) {
        const $this = $(this);
        updateValidatedField($this, validator.check($this.val(), $this.attr('name')));
    })
    .on('click', '.input__dropdown-btn', function(e) {
        e.stopPropagation();
        $(this).toggleClass('is-active');
    })
    .on('click', '.input__dropdown-list-item', function(e) {
        e.stopPropagation();
        const $this = $(this);
        const $parent = $this.closest('.input');
        $parent.find('.input__dropdown-btn').text($this.text()).removeClass('is-active');
        clearValidate($parent.find('.input__field'));
        $parent.find('.input__field').val($this.data('value')).addClass('is-noempty').trigger('change');
    })
    .on('submit', '.form__form', function(e) {
        e.preventDefault();
        const $fields = $(this).find('.input__field');
        const data = [];
        $fields.each(function(index) {
            const $this = $(this);
            let validationResult = {
                status: true,
            };
            if($this.hasClass('is-required')) {
                validationResult = validator.check($this.val(), $this.attr('name'));
                updateValidatedField($this, validationResult);
            }
            if(validationResult.status) {
                data[$this.attr('name')] = $this.val();
            }
        });

        if(Object.keys(data).length === $fields.length) {
            // тут отправка на сервер
            console.log(data);
        }
        return false;
    });
});
