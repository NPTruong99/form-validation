// Đối tượng `Validator`
function Validator(options) {
    let selectorRules = {};

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        let errorMessage;
        let errorElement = inputElement.parentElement.querySelector(
            options.errorSelector
        );

        // Lấy ra các rule của selector
        let rules = selectorRules[rule.selector];

        // Lặp qua từng rule & kiểm tra
        // Nếu có lỗi thì dừng kiểm tra
        for (let i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add("invalid");
        } else {
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove("invalid");
        }

        return !errorMessage;
    }

    // Lấy element của form cần validate
    let formElement = document.querySelector(options.form);

    if (formElement) {
        // Khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            let isFormValid = true;

            // Lặp qua từng rules và Validate
            options.rules.forEach(function (rule) {
                let inputElement = formElement.querySelector(rule.selector);
                let isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Trường hợp submit với Javascript
                if (typeof options.onSubmit === "function") {
                    let enableInput = formElement.querySelectorAll("[name]");

                    let formValue = Array.from(enableInput).reduce(function (
                        values,
                        input
                    ) {
                        values[input.name] = input.value;
                        return values;
                    },
                    {});

                    options.onSubmit(formValue);
                }
                // Trường hợp submit với hành vi mặc định
                else {
                    formElement.onsubmit();
                }
            }
        };

        // Lặp qua từng rules và xử lý
        options.rules.forEach(function (rule) {
            // Lưu lại các rule cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

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

Validator.isConfirmed = function (selector, getConfirmValue) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue()
                ? undefined
                : "The password confirmation does not match";
        },
    };
};
