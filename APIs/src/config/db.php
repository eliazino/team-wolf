<?php
error_reporting();
class db{
	/*
		Config
	*/
	/*
		Connection
	*/
	public function connect(){
		$file_db = new PDO('sqlite:messaging.sqlite3');
    // Set errormode to exceptions
    	$file_db->setAttribute(PDO::ATTR_ERRMODE, 
                            PDO::ERRMODE_EXCEPTION);
 
    // Create new database in memory
    	$memory_db = new PDO('sqlite::memory:');
    // Set errormode to exceptions
   		 $memory_db->setAttribute(PDO::ATTR_ERRMODE, 
                              PDO::ERRMODE_EXCEPTION);
		/*$dbh = new PDO("mysql:host=$this->dbhost;dbname=$this->dbname", $this->dbuser, $this->dbpass);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);*/
		return $file_db;
	}
	public function localConnect(){
		$file_db = new PDO('sqlite:messaging.sqlite3');
    // Set errormode to exceptions
    	$file_db->setAttribute(PDO::ATTR_ERRMODE, 
                            PDO::ERRMODE_EXCEPTION);
 
    // Create new database in memory
    	$memory_db = new PDO('sqlite::memory:');
    // Set errormode to exceptions
   		 $memory_db->setAttribute(PDO::ATTR_ERRMODE, 
                              PDO::ERRMODE_EXCEPTION);
		/*$dbh = new PDO("mysql:host=$this->dbhost;dbname=$this->dbname", $this->dbuser, $this->dbpass);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);*/
		return $file_db;
	}
	function startToday(){
		$t = (time()%86400);
		$today = (time() - $t);
		$dbInstance = $this->connect();
		$sql = "select * from limithistory where day = '$today'";
		if(!$this->isExist($sql)){
			$r = "insert into limithistory (amount, day, `left`) values (:amount, :day, :left)";
			$data = $this->selectFromQuery("SELECT max(id), tlimit  from settings");
			$data = json_decode($data);
			$amount = $data[0]->tlimit;
			$f = $dbInstance->prepare($r);
			$amount = (isset($amount) and is_numeric($amount))? $amount : 0;
			$f->bindParam(':amount', $amount);
			$f->bindParam(':day', $today);
			$f->bindParam(':left', $amount);
			$f->execute();
		}
	}
	function unArray($str){
		if(substr($str, 0, 1) == "["){
			$newStr = json_decode($str);
			$newArr = $newStr[0];
			$newArr = json_encode($newArr);
			return $newArr;
		}else{
			return $str;
		}
	}
	function createLog($admin, $category, $comment){
		$time = time();
		$sql = "insert into activitylog (actionTime, actionDetails, actionCategory, username) values (:actionTime, :actionDetails, :actionCategory, :username)";
		$dbn = $this->connect();
		try{
			$f = $dbn->prepare($sql);
			$f->bindParam(':actionTime', $time);
			$f->bindParam(':actionDetails', $comment);
			$f->bindParam(':actionCategory', $category);
			$f->bindParam(':username', $admin);
			$f->execute();
		}catch(Exception $e){

		}
	}
	public function jsonFormat($json){
		$type = gettype($json);
		if($type != "array"){
			$json = (urldecode($json) != null)? urldecode($json) : $json;
			$json = $this->cleanJson($json);
		}else{
			$json = json_encode($json);
		}
		if($this->isJson($json)){
			return json_decode($json);
		}else{
			return NULL;
		}
	}
	function isJson($string) {
		json_decode($string);
		return (json_last_error() == JSON_ERROR_NONE);
	}
	function responseFormat($resp, $obj){
		return $resp->withStatus(200)
		->withHeader('Content-Type', 'application/json')
	  	->withHeader('Access-Control-Allow-Origin', '*')
	 	->withHeader('Access-Control-Allow-Headers', array('Content-Type', 'X-Requested-With', 'Authorization', 'PI'))
	  	->withHeader('Access-Control-Allow-Methods', array('GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'))
		->write($obj);
	}
	function cleanException($ex){
		$poison = array("'", "\\", "\"");
		$exf = str_replace($poison, "", $ex);
		return $exf;
	}
	function cleanJson($json){
		$start = array();
		$endIndex = array();
		$count = 0;
		$json = trim($json);
		while($count < strlen($json)){
			if(substr($json,$count, 1) == "{"){
				array_push($start,$count);
			}else if(substr($json,$count, 1) == "}"){
				array_push($endIndex,$count);
			}else{
			}
			$count++;
		}
		return substr($json, $start[0], $endIndex[count($endIndex)-1] - $start[0] + 1);
	}

	function isExist($query){
		$dbn = $this->connect();
		$q = $dbn->query($query);
		if($q->fetchColumn() > 0){
			return true;
		}else{
			return false;
		}
	}
	function isExistV2($query, $binds){
		$db = $this->connect();
		$f = $db->prepare($query);
		for($i = 0; $i < count($binds); $i++){
			$f->bindParam($i+1, $binds[$i]);
		}
		$f->execute();
		$row = $f->fetchAll(PDO::FETCH_ASSOC);
		//var_dump($row);
		if($row){
			//if($row[0]["coun"])
			return true;
		}else{
			return false;
		}
	}
	function queryCount($query){
		$dbn = $this->connect();
		$q = $dbn->query($query);
		try{
			if($q->fetchColumn() > 0){
				return $q->fetchColumn();
			}else{
				return 0;
			}
		}catch(PDOException $e){
			return 0;
		}
	}
	function staffExist($username, $publicKey){
		return $this->isExistV2("select*from admin where username = ? and publicKey = ?", array($username, $publicKey));
	}
	function selectFromQuery($query){
		$db = $this->connect();
		$f = $db->prepare($query);
		$f->execute();
		$row = $f->fetchAll(PDO::FETCH_ASSOC);
		if($row){
			$data = json_encode($row, true);
		}else{
			$data = "[]";
		}
		return $data;
	}
	function selectLocalQuery($query){
		$db = $this->localConnect();
		$f = $db->prepare($query);
		$f->execute();
		$row = $f->fetchAll(PDO::FETCH_ASSOC);
		if($row){
			$data = json_encode($row, true);
		}else{
			$data = "[]";
		}
		return $data;
	}
	function selectFromQueryV2($query, $binds = array()){
		$db = $this->connect();
		$f = $db->prepare($query);
		for($i = 0; $i < count($binds); $i++){
			$f->bindParam($i+1, $binds[$i]);
		}
		$f->execute();
		$row = $f->fetchAll(PDO::FETCH_ASSOC);
		if($row){
			$data = json_encode($row, true);
		}else{
			$data = "[]";
		}
		return $data;
	}
	function sendThis($to, $message){
		$header = "From: HealthTouch Alert <no-reply@healthtouch.me>\r\n"; 
			$header .= "To: ".$to." \r\n"; 
			$header.= "MIME-Version: 1.0\r\n"; 
			$header.= "Content-Type: text/html; charset=ISO-8859-1\r\n"; 
			$header.= "X-Priority: 1\r\n";
			if(is_array($message)){
				$body = $message[0];
				$subject = $message[1];
			}else{
				$subject = "Enrolee Transaction Notice";
				$body = $message;
			}
			if(mail($to,$subject,$body,$header)){
				return true;
			}else{
				return false;
			}
	}
	function thisInThat($needle, $jsonStack){
		$counter = 0;
		$isFound = -1;
		while($counter < count($jsonStack)){
			$obj = $jsonStack[$counter]->serviceID;
			if($obj == $needle){
				$isFound = $counter;
				break;
			}
			$counter++;
		}
		return $isFound;
	}
	function findMonthBound($month){
		$first_minute = mktime(0, 0, 0, $month, 1);
    	$last_minute = mktime(23, 59, 0, $month, date('t', $first_minute));
    	$times = array($first_minute, $last_minute);
		return $times;
	}
	function  base64ToImage($string, $output){
		$ifp = fopen($output, 'wb');
		$data = explode(',', $string);
		//$output = $output.".jpg";
		try{
			if(count($data) == 2){				
				fwrite($ifp, base64_decode($data[1]));
				fclose($ifp);
				$imgsize = getimagesize($output);
				$width = $imgsize[0];
				$height = $imgsize[1];
				$thumbName = $output."_thumb.jpg";
				$this->resize_crop_image(270, 270, $output, $thumbName, 75);
				$this->resize_crop_image($width, $height, $output, $output, 65);
				return $output;
			}elseif(count($data) == 1){
				fwrite($ifp, base64_decode($data[0]));
				fclose($ifp);
				$imgsize = getimagesize($output);
				$width = $imgsize[0];
				$height = $imgsize[1];
				$thumbName = $output."_thumb.jpg";
				$this->resize_crop_image(270, 270, $output, $thumbName, 75);
				$this->resize_crop_image($width, $height, $output, $output, 65);
				return $output;		
			}else{
				return null;
			}
		}catch(Exception $e){
			return null;
		}
	}
	function resize_crop_image($max_width, $max_height, $source_file, $dst_dir, $quality){
		$imgsize = getimagesize($source_file);
		$width = $imgsize[0];
		$height = $imgsize[1];
		$mime = $imgsize['mime'];
		switch($mime){
		 case 'image/gif':
		  $image_create = "imagecreatefromgif";
		  $image = "imagegif";
		  break;
		 case 'image/png':
		  $image_create = "imagecreatefrompng";
		  $image = "imagepng";
		  $quality = $quality/10;
		  break;
		 case 'image/jpeg':
		  $image_create = "imagecreatefromjpeg";
		  $image = "imagejpeg";
		  $quality = $quality;
		  break;
		 default:
		  return false;
		  break;
		}
		$dst_img = imagecreatetruecolor($max_width, $max_height);
		$src_img = $image_create($source_file);
		$width_new = $height * $max_width / $max_height;
		$height_new = $width * $max_height / $max_width;
		//if the new width is greater than the actual width of the image, then the height is too large and the rest cut off, or vice versa
		if($width_new > $width){
		 //cut point by height
		 $h_point = (($height - $height_new) / 2);
		 //copy image
		 imagecopyresampled($dst_img, $src_img, 0, 0, 0, $h_point, $max_width, $max_height, $width, $height_new);
		}else{
		 //cut point by width
		 $w_point = (($width - $width_new) / 2);
		 imagecopyresampled($dst_img, $src_img, 0, 0, $w_point, 0, $max_width, $max_height, $width_new, $height);
		}
		$image($dst_img, $dst_dir, $quality);
		if($dst_img)imagedestroy($dst_img);
		if($src_img)imagedestroy($src_img);
	}
	function genID($count){
		$chars = str_split("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
		$v = "";
		$max = count($chars);
		for($i = 0; $i < $count; $i++){
			$v = $v."".$chars[rand(0,$max-1)];
		}
		return $v;
	}
}
?>