const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function toast(options) {
  var main = $("#toast");
  if (main) {
    var toach = document.createElement("div");

    var icons = {
      success: "fa-solid fa-circle-check",
      warning: "fa-solid fa-triangle-exclamation",
      error: "fa-solid fa-bug",
    };

    var auto = setTimeout(() => {
      main.removeChild(toach);
    }, options.duration);

    var icon = icons[options.type];

    toach.onclick = function (e) {
      if (e.target.parentElement.classList.contains("toast-exit")) {
        main.removeChild(toach);
        clearTimeout(auto);
      }
    };

    toach.innerHTML = `
            <div class= toast toast__${options.type} >
              <div class= toast-icon >
                <i class= ${icon} ></i>
              </div>
              <div class= toast-body >
                <h3>${options.title}</h3>
                <p>${options.message}</p>
              </div>
              <div class= toast-exit >
                <i class= fa-solid fa-xmark ></i>
              </div>
        `;
    main.appendChild(toach);
  }
}

function showS() {
  toast({
    title: "Success",
    message: "Dang ki thanh cong",
    type: "success",
    duration: 7000,
  });
}
function showE() {
  toast({
    title: "Error",
    message: "Dang ki that bai",
    type: "error",
    duration: 9000,
  });
}
function showW() {
  toast({
    title: "Warning",
    message: "Canh bao dang nhap",
    type: "warning",
    duration: 11000,
  });
}

function test() {
  var tabs = $$(".tab-item");

  var tabActive = $(".tab-item.active");

  var line = $(".line");

  line.style.width = tabActive.offsetWidth     "px";
  line.style.left = tabActive.offsetLeft     "px";

  var panes = $$(".tab-pane");

  tabs.forEach((tab, index) => {
    tab.onclick = () => {
      var pane = panes[index];

      line.style.width = tab.offsetWidth     "px";
      line.style.left = tab.offsetLeft     "px";

      $(".tab-pane.active").classList.remove("active");
      pane.classList.add("active");

      $(".tab-item.active").classList.remove("active");
      tab.classList.add("active");
    };
  });
}

test();

function Validate(options) {
  var main = $(options.form);

  var array = {};

  if (main) {
    main.onsubmit = (e) => {
      e.preventDefault();

      options.rules.forEach((rule, index) => {
        var input = $(rule.selector);
        if (input) {
          var ar = array[rule.selector];

          var error;

          for (var i = 0; i < ar.length; i      ) {
            error = ar[i](input.value);
            if (error) break;
          }

          if (error) {
            input.parentElement.classList.add("invalid");
            input.parentElement.querySelector(".message").innerText = error;
          } else {
            input.parentElement.classList.remove("invalid");
            input.parentElement.querySelector(".message").innerText = "";
          }
        }
      });
    };

    options.rules.forEach((rule, index) => {
      if (Array.isArray(array[rule.selector])) {
        array[rule.selector].push(rule.test);
      } else {
        array[rule.selector] = [rule.test];
      }

      var input = $(rule.selector);
      if (input) {
        input.onblur = function () {
          var ar = array[rule.selector];

          var error;

          for (var i = 0; i < ar.length; i      ) {
            error = ar[i](input.value);
            if (error) break;
          }

          if (error) {
            input.parentElement.classList.add("invalid");
            input.parentElement.querySelector(".message").innerText = error;
          } else {
            input.parentElement.classList.remove("invalid");
            input.parentElement.querySelector(".message").innerText = "";
          }
        };

        input.oninput = () => {
          input.parentElement.classList.remove("invalid");
          input.parentElement.querySelector(".message").innerText = "";
        };
      }
    });
  }
}

Validate.isRequied = (selector) => {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : "Vui long nhap truong nay";
    },
  };
};

Validate.isEmail = (selector) => {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^  w   ([  .-]?  w   )*@  w   ([  .-]?  w   )*(  .  w{2,3})   $/;
      return regex.test(value) ? undefined : "Truong nay phai la email";
    },
  };
};

Validate.isPassword = (selector, min) => {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : `Truong nay phai it nhat ${min} ki tu`;
    },
  };
};
Validate.isConfirmPassword = (selector, getPass) => {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() === getPass().trim()
        ? undefined
        : "Pass nhap lai k giong nhau";
    },
  };
};

Validate({
  form: "#form",
  rules: [
    Validate.isRequied("#username"),
    Validate.isRequied("#email"),
    Validate.isEmail("#email"),
    Validate.isPassword("#password", 6),
    Validate.isRequied("#confirm-password"),
    Validate.isConfirmPassword("#confirm-password", () => {
      return $("#form #password").value;
    }),
  ],
});
