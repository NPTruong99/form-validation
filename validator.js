// Đối tượng `Validator`
function Validator(options) {
    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        let errorMessage = rule.test(inputElement.value);
        let errorElement = inputElement.parentElement.querySelector(
            options.errorSelector
        );
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add("invalid");
        } else {
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove("invalid");
        }
    }

    // Lấy element của form cần validate
    let formElement = document.querySelector(options.form);

    if (formElement) {
        options.rules.forEach(function (rule) {
            let inputElement = formElement.querySelector(rule.selector);
            let errorElement = inputElement.parentElement.querySelector(
                options.errorSelector
            );
            if (inputElement) {
                // Xử lý blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                };

                // Xử lý khi blur vào input
                inputElement.oninput = function () {
                    errorElement.innerText = "";
                    inputElement.parentElement.classList.remove("invalid");
                };
            }
        });
    }
}

// Định nghĩa các rules
// Nguyên tắc của các rules:
// 1.Khi có lỗi: trả ra messages lỗi
// 2. Khi không có lỗi: undefined
Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : "This field cannot be empty";
        },
    };
};

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value)
                ? undefined
                : "Please provide a properly formatted email address";
        },
    };
};

Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min
                ? undefined
                : `Password must be at least ${min} characters long`;
        },
    };
};
