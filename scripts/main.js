var questionUrl = null;

window.onload = function()
{
    console.log(chrome.tabs.query(
        {'active': true, 'lastFocusedWindow': true},
        function (tabs)
        {
            let pattern = /^https:\/\/www.zhihu.com\/question\/[0-9]*/;
            try
            {
                questionUrl = pattern.exec(tabs[0].url)[0];
            }
            catch
            {
                alert("当前打开页面不是知乎问题页面!");
                window.close();
            }
        }));
}

document.getElementById("invite-button").onclick = function()
{
    let inviteeUrl = document.getElementById("invitee-url").value;

    let url = "https://www.zhihu.com/api/v4/members/" + inviteeUrl.split('/').pop();
    let xhr = new XMLHttpRequest();

    xhr.open("GET", url, false);
    
    let memberHash = null;
    let responseData = null;
    let inviteeName = null;
    try
    {
        xhr.send();
        responseData = JSON.parse(xhr.responseText);
        memberHash = responseData["id"];
        inviteeName = responseData["name"];
    }
    catch (e)
    {
        console.log(e);
        alert("输入网址不合法!");
        return;
    }

    url = "https://www.zhihu.com/api/v4/questions/" + questionUrl.split('/').pop() + "/invitees";
    xhr = new XMLHttpRequest();

    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    let payload = {
        "member_hash": memberHash,
        "src": "normal"
    };
    xhr.send(JSON.stringify(payload));

    responseData = JSON.parse(xhr.responseText);
    if (responseData["success"] == true)
    {
        alert("已成功邀请" + inviteeName + "回答本问题!");
    }
    else
    {
        alert("邀请失败!\n错误信息: " + responseData["error"]["message"]);
    }
}
