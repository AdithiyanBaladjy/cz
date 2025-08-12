var acc = document.getElementsByClassName("accordion");
          var i;

          for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
              this.classList.toggle("active");
              var panel = this.nextElementSibling;
              var arr = this.getElementsByClassName("arrow down")[0].id;
              if (panel.style.display === "block") {
                panel.style.display = "none";
                document.getElementById(arr).style.transform = "rotate(45deg)";
                document.getElementById(arr).style.transition = "all 0.5s ease";
              } else {
                panel.style.display = "block";
                panel.style.transition = "opacity 1.5s linear";
                document.getElementById(arr).style.transform = "rotate(-137deg)";
                document.getElementById(arr).style.transition = "all 0.5s ease";
              }
            });
          }