$(document).ready(function(){
  $(".sk-fading-circle, .spinnerMessage").hide();

   if (localStorage.getItem("targetRT_data") !== null) {
     let localData = JSON.parse(localStorage.getItem("targetRT_data"));
     let fieldList = Object.keys(localData);

     fieldList.forEach((field, index) => {
       $("[name=" + field + "]").val(localData[field]);
     });
   }

   //To clear all local storage, use below line of code
   //localStorage.clear();

   $("#minerTable").on("click", ".restart", function() {
     let value = $(this).attr("name");
     let id = (value.split("_"))[1];
     let url = "/miners/" + id + "/restart";
     console.log(id);
     $(".sk-fading-circle, .restartMessage").show();

     $.ajax({
       type: "POST",
       url: url,
       success: function(result) {
         setTimeout(function() {
           window.location.href = "/miners";
         }, 3000);
       }
     })
   });

   $(".targetRT, .poolSettings").submit(function(){
      return false;
   });

   $(".targetRT").on("submit", function() {
     let data = {};

     // Credit: T.J. Crowder -- https://stackoverflow.com/questions/5603117/jquery-create-object-from-form-fields
     $(".targetRT").find("input, textarea, select").each(function() {
       let inputType = this.tagName.toUpperCase() === "INPUT" && this.type.toUpperCase();
       if (inputType !== "BUTTON" && inputType !== "SUBMIT") {
         data[this.name] = $(this).val();
       }
     });
     console.log(data);
     localStorage.setItem("targetRT_data", JSON.stringify(data));
   });

   $("#minerTable").on("click", ".submitPoolSettings", function() {
     let data = {};
     let value = $(this).attr("name");
     let id = (value.split("_"))[1];
     // console.log("Get miner id from naming system: " + id);

     data.poolURL = $("[name='poolURL_" + id + "']").val();
     data.poolUser = $("[name='poolUser_" + id + "']").val();
     data.poolPass = $("[name='poolPass_" + id + "']").val();
     console.log(data);
     $(".sk-fading-circle, .switchpoolMessage").show();

     let url = "/miners/" + id + "/switchpool";
     $.ajax({
       type: "POST",
       url: url,
       data: data,
       success: function(result) {
         setTimeout(function() {
           window.location.href = "/miners";
         }, 3000);
       }
     })
   });

});
