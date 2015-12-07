<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib uri="webwork" prefix="ww"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>${compname}-帮助中心</title>
<ww:head name="help"/>
<script src="js/jquery/jquery1.3.2.js" type="text/javascript"></script>
<script src="js/jquery/jquery.validationEngine-cn.js" type="text/javascript"></script>
<script src="js/jquery/jquery.validationEngine.js" type="text/javascript"></script>
</head>
<script>
//展开第一项
var index=<ww:property value="Informationid"/>;
$(document).ready(function (){
	if(index=='0'){
	//alert("..");
	//	$("#help1").addClass('open');
 	//	$("#nhelp1").show();
	}
		
});
var size=<ww:property value="ListInformation.size"/>

function check(index){

	for(i=1;i<=size;i++){
		//控制关和
		 $("#help"+i).removeClass('open');
		 $("#help"+i).removeClass('close');
		 $("#help"+i).addClass('close');
		 
		 //控制下级显示
		  $("#nhelp"+i).hide();
		 
		 
		 
		 
		 
		 
	}
 		$("#help"+index).addClass('open');
 		$("#nhelp"+index).show();
}

</script>
<body>
<div id="container">
<div class="center"><ww:include page="../top.jsp?index=6" /></div>
 <!--includ top 直接替换掉整个DIV-->
</div> 
<div id="help">
   <div id="help_left" class="f mt10">
     <div class="helptitle">
      <span class="why f"></span><font class="fff14">帮助中心</font>
     </div>
     <div class="box">
        <ul>
         <%int j = 1; int i = 1;%>
        <ww:iterator value="ListInformation" status="t">
      <!-- index!toInformationType.jspx?HelpcenterID=<ww:property value="id"/> -->
        <li   <ww:if test="Informationid==id">class="open"</ww:if><ww:else>class="close"</ww:else>  id='help<%=i%>'
        onclick="check(<%=i%>)">  <a href="#"><ww:property value="name"/></a></li>
         <!-- onclick="onloadcss(<%=i%>)" -->
       <ww:if test="getInformationLastById(id).size>0">
		        <li class="box_over" id="nhelp<%=i%>"  <ww:if test="Informationid==id">style='display: block;'</ww:if><ww:else>style='display: none;'</ww:else> >
		        <dl class="openlist">
			        <ww:iterator value="getInformationLastById(id)">
			       <a href="index!toInformationinfo.jspx?HelpcenterID=<ww:property value="id"/>"><dt class="list"><ww:property value="name"/></dt></a>
			        </ww:iterator>
		        </dl>
		        </li>
	        </ww:if>
	        <%i++;%>
        </ww:iterator>
       
        </ul>
     </div>
   </div>
   <div id="help_right" class="r mt7">
      <form action="index!toInformationinfo.jspx" method="post">
      <div class="searh">
         <ul>
         <li><input name="s_name" type="text" class="searh_text mr25"   value="<ww:property value="s_name"/>" /><input type="submit" class="searh_bnt fff14" value="立即搜索"  /></li>
         <li class="dd2626 searhtips"><span class="wenhao f">&nbsp;</span><font class="f pt5" >热门问题：如何注册，如何买票，签证常识...</font></li>
         </ul>
      </div>
      <input name="HelpcenterID" type="hidden" class="searh_text mr25"   value="<ww:property value="HelpcenterID"/>" />
      
     </form> 
      <div class="msg helpmain mt3">
        <ul class="msgul">
              <li class="box_over pf5 helptips">
              <font class="l06c"><ww:property value="onename"/></font><font class="mlr">></font>
              <font class="l06c"><ww:property value="twoname"/></font><font class="mlr">></font>
              <font class="un000"><ww:property value="threename"/></font>
              </li>
              <li class="helptips">
                 <ul class="mainul">
                   <li class="box_botm_xu">	<h3 class="mlr f90" align="center"><ww:property value="informationinfo.name" /></h3></li>
                   <li class="mainsoy">
                   <p><ww:property value="informationinfo.info" /></p>

                 </ul> 
              </li>
         </ul>  
      </div>
   </div>
   <div class="nohave"></div>
</div>
<ww:include page="../footer.jsp"/> 
</body>
</html>