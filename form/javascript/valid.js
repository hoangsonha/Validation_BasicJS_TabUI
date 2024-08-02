// options la doi tuong dc truyen vao trong ham Validator trong dau {}

function Validator(options) {


    function getParent(inputElement, selector) {        // ta truyen vao la cai inputElemnt chúng ta đang đứng tìm ra thẻ cha với selector = '.form-group' trong trường hợp nhiêu thẻ div
        while (inputElement.parentElement) {
            if(inputElement.parentElement.matchs(selector)) {
                return inputElement.parentElement;
            }
            inputElement = inputElement.parentElement;
        }
    }


    var selectorRules = {};

    function validate(inputElement, rule) {
        var errorMessage; //  = rule.test(inputElement.value);

        var rules = selectorRules[rule.selector];

        // có 2 rules thì mình dùng vòng lập
        // neu rule co loi thi dung viec kiem tra
        for(var i=0; i<rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);

            if(errorMessage) break;
        }


        // var errorElement = getParent(inputElement, '.form-group').querySelector...              // su dung ham getParent
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

                    if(errorMessage) {
                        errorElement.innerText = errorMessage;
                        
                        // lay cai mau red
                        inputElement.parentElement.classList.add('invalid');

                    } else {
                        errorElement.innerText = '';
                        inputElement.parentElement.classList.remove('invalid');
                    }

        return !errorMessage;  // true neu co loi, k co loi la false
                    
    }


// lay ra form-id 

    var formElement = document.querySelector(options.form);

        if(formElement) {

            


            // Xử lí khi ;ập qua mỗi rules (Lắng nghe sự kiện)

            // khi submit thì k chuyển trang submit

            formElement.onsubmit = function(e) {
                e.preventDefault();


                var forminValid = true;

                // Lập qua từng rule và invalid các trường khi submit

                options.rules.forEach(function (rule) {

                    var inputElement = formElement.querySelector(rule.selecttor);

                    var inValid = validate(inputElement, rule);

                    if(!isValid) {
                        forminValid = false;
                    }
                    
                });  
                
                // if(forminValid) {
                //     console.log('Khong co loi')
                // } else {
                //     console.log('co loi')
                // }


                var enableInput = formElement.querySelectorAll('[name]')  // select cac feild la name va k co select cac fiel disabled ('[name]:not([disabled])') khi ô inputt có disable

           //     console.log(enableInput);  sẽ trả ra 4 cái ô input

                

                if(forminValid) {
                    if(typeof options.onsubmit === 'function') {

                        var formValues = Array.from(enableInput).reduce(function (value, input) {
                            
                            value[input.name] = input.value   // tranh gia tri null neu && return null se hong truong trinh

                            return value;  // toan tu && se return ra cai cuoi cung la value
        
                        }, {});  // conveert cai enable tu nodeList sang array de su dung reduce

                        options.onsubmit( {
                            formValues
                        })
                    }
                }
                
            }

        
            options.rules.forEach(function (rule) {
            

                // lưu  lại các rules cho mỗi ô input

                if(Array.isArray(selectorRules[rule.selector])) {
                    selectorRules[rule.selector].push(rule.test);
                } else {
                    selectorRules[rule.selector] = [rule.test];
                }

            
// de in ra cai id cua 2 cai trong form console.log(rule.selecttor);
        
            var inputElement = formElement.querySelector(rule.selecttor);
            
            console.log(inputElement);
            
            if(inputElement) {

                // xu li truong hop blur ra khoi trang
                inputElement.onblur = function () {

                    validate(inputElement, rule);

// in ra khi blur o input  console.log('blur ' + rule.selecttor);
                
                    
// lay ra value cua input  console.log(inputElement.value);

                    

// lay ra cha cua no r tim tk con  console.log(inputElement.parentElement.querySelector('.form-message'));

                }

                // xu li khi nguoi dung nhap vao input, dang nhap k dc co mau red
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
    }

}

// nguyen tac cua ham test : 
// -- Khi co loi  return message loi
// -- khi k co loi return undefined (k tra ra cai j ca)
Validator.isRequired = function(selecttor) {
    return {
        selecttor: selecttor,     // key va value deu la selector
        test: function (value) {   // kiem tra xem nguoi dung nhap hay chua
            return value.trim() ? undefined : 'Vui long nhap truong nay'
        }
    };
}



// nguyen tac cua ham test : 
// -- Khi co loi  return message loi
// -- khi k co loi return undefined (k tra ra cai j ca)
Validator.isEmail = function(selecttor) {
    return {
        selecttor: selecttor,     // key va value deu la selector
        test: function (value) {    // kiem tra xem co phai email hay k
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Truong nay phai la email';
        }
    };
}

Validator.minLength = function(selecttor, min) {
    return {
        selecttor: selecttor,     // key va value deu la selector
        test: function (value) {    // kiem tra xem co phai email hay k
            
            return value.length >= min ? undefined : `Vui long nhap toi thieu ${min} ki tu`;
        }
    };
}

Validator.isConfirm = function(selecttor, getConfirmValue, message) {
    return {
        selecttor: selecttor,     // key va value deu la selector
        test: function (value) {    // kiem tra xem co phai email hay k
            
            return value===getConfirmValue() ? undefined : message || 'Gia tri nhap vao k chinh xac';

            // nếu có message thì lấy message, còn k thì lấy cái còn lại

            // Làm như này để k fix cứng cái message, dùng nhiều ở chỗ khác nữa
        }
    };
}









