<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
$app = new \Slim\App;
//error_reporting(0);
ini_set('max_execution_time', 300);

$app->post('/api/fmcg/create/product', function(Request $req, Response $resp){
	$json = $req->getParsedBody();
	$json = isset($json)? $json : $req->getBody();
	$dbn = new db();
	$validJson = $dbn->jsonFormat($json);
	if(!($validJson === NULL)){
		try{
			$data = $validJson->data;
			if(isset($data->username) and isset($data->publicKey)){
				if($dbn->isExistV2("select*from fmcg where username = ? and publicKey = ?", array($data->username, $data->publicKey))){
					if(strlen($data->name) > 5){
						$q = "insert into product (name) VALUES (:name)";
						$mcrypto = new mcrypt();
						$merchantID = $mcrypto->mCryptThis(time()."/".rand(1000,200000));
						$Qin = $dbn->connect();
						$f = $Qin->prepare($q);
						$dateAdded = time();
						$f->bindParam(":name", $data->name);						
						$f->execute();						
						$g = '{"error":{"message":"", "status":"0"},"success":{"message":"New outlet created","status":"200"}, "content":{}}';
					}else{
						$g = '{"error":{"message":"All Profile fields are required", "status":"1"}}';
					}
				}else{
					$g = '{"error":{"message":"The Auth profile have not been found", "status":"1"}}';
				}
			}else{
				$g = '{"error":{"message":"The staff profile have not been found", "status":"1"}}';
			}
		}catch(PDOException $e){
			$e = $dbn->cleanException($e->getMessage());
			$g = '{"error":{"message":"An error:'.$e.' Ocurred", "status":"1"}}';
		}
	}else{
		$g = '{"error":{"message":"The parameter is not a valid object", "status":"1"}}';
	}
	return $dbn->responseFormat($resp,$g);
});

$app->post('/api/fmcg/create/shipment', function(Request $req, Response $resp){
	$json = $req->getParsedBody();
	$json = isset($json)? $json : $req->getBody();
	$dbn = new db();
	$validJson = $dbn->jsonFormat($json);
	if(!($validJson === NULL)){
		try{
			$data = $validJson->data;
			if(isset($data->username) and isset($data->publicKey)){
				if($dbn->isExistV2("select*from fmcg where username = ? and publicKey = ?", array($data->username, $data->publicKey))){
					if(strlen($data->name) > 5){
						$q = "insert into shipments (transDate, distID, product, count, state, shipmentID) VALUES (:transDate, :distID, :product, :count, :state, :shipmentID)";
						$mcrypto = new mcrypt();
						$merchantID = $mcrypto->mCryptThis(time()."/".rand(1000,200000));
						$Qin = $dbn->connect();
						$f = $Qin->prepare($q);
						$date = time();
						$f->bindParam(":transDate", $date);
						$f->bindParam(":distID", $data->distID);
						$f->bindParam(":product", $data->product);
						$f->bindParam(":count", $data->count);
						$f->bindParam(":state", $data->state);
						$f->bindParam(":shipmentID", $data->shipmentID);
						$f->execute();
						$g = '{"error":{"message":"", "status":"0"},"success":{"message":"New Shipment created","status":"200"}, "content":{}}';
					}else{
						$g = '{"error":{"message":"All Profile fields are required", "status":"1"}}';
					}
				}else{
					$g = '{"error":{"message":"The Auth profile have not been found", "status":"1"}}';
				}
			}else{
				$g = '{"error":{"message":"The staff profile have not been found", "status":"1"}}';
			}
		}catch(PDOException $e){
			$e = $dbn->cleanException($e->getMessage());
			$g = '{"error":{"message":"An error:'.$e.' Ocurred", "status":"1"}}';
		}
	}else{
		$g = '{"error":{"message":"The parameter is not a valid object", "status":"1"}}';
	}
	return $dbn->responseFormat($resp,$g);
});

$app->post('/api/fmcg/login', function(Request $req, Response $resp){
	$json = $req->getParsedBody();
	$json = isset($json)? $json : $req->getBody();
	$dbn = new db();
	$validJson = $dbn->jsonFormat($json);
	if(!($validJson == NULL)){
		try{
			$data = $validJson->data;
			$username = $data->username;
			$password = $data->password;
			if(isset($username) and isset($password)){
				$key = ' FitSKchgoHOOKing666';
				$string = $key.'34iIlm'.$password.'io9m-';
				$encryptedPassword = hash('sha256', $string);
				$mcrypto = new mcrypt();
				$lastseen = time();
				$publicKey = $mcrypto->mCryptThis(time());
				$sql = "select * from fmcg where username = ? and password = ?";
				$Qi = $dbn->connect();
				if ($dbn->isExistV2($sql, array($username, $encryptedPassword))) {
					$sql = "update fmcg set publicKey = :publicKey where username = :username";
					$stmt = $Qi->prepare($sql);
					$stmt->bindValue(":publicKey", $publicKey);
					$stmt->bindValue(":username", $username);
					$stmt->execute();
					$t = "select fullname, phone, email, username, publicKey from fmcg where username = ?";
					$data = $dbn->selectFromQueryV2($t, array($username));
					$datums = json_decode($data);
					$g = '{"error":{"message":"", "status":"0"}, "success":{"message":"Login successful", "status":"200"}, "content":{"data":'.$data.'}}';
				}else{
					$g = '{"error":{"message":"Login credentials match not found", "status":"1"}}';
				}
			}else{
				$g = '{"error":{"message":"All Profile fields are required", "status":"1"}}';
			}
		}catch(PDOException $e){
			$e = $dbn->cleanException($e->getMessage());
			$g = '{"error":{"message":"An error:\''.$e.'\' Ocurred", "status":"1"}}';
		}
	}else{
		$g = '{"error":{"message":"The parameter is not a valid object", "status":"1"}}';
	}
	return $dbn->responseFormat($resp,$g);
});

$app->post('/api/dist/create/self', function(Request $req, Response $resp){
	$json = $req->getParsedBody();
	$json = isset($json)? $json : $req->getBody();
	$dbn = new db();
	$validJson = $dbn->jsonFormat($json);
	if(!($validJson === NULL)){
		try{
			$data = $validJson->data;
			if(true){
				if(true){
					$name = $data->name;
					$phone = $data->phone;
					$email = $data->email;
					$address = $data->address;
					$state = $data->state;
					$lg = $data->lg;
					$username = $data->username;
					$password = $data->password;
					$key = ' FitSKchgoHOOKing666';
					$string = $key.'34iIlm'.$password.'io9m-';
					$encryptedPassword = hash('sha256', $string);
					if(isset($username) and !$dbn->isExistV2("select*from distributors where username = ?", array($username))){
					if(isset($name) and isset($phone) and isset($email)){
						if(is_numeric($phone)){
							if(!$dbn->isExistV2("select*from distributors where email = ?", array($email))){
								if(!$dbn->isExistV2("select*from distributors where phone = ?", array($phone))){
									$dbn = $dbn->connect();
									$sql = "INSERT INTO distributors (name, email, phone, password, username, dateCreated, state,  lg, address) VALUES (:name, :email, :phone, :password, :username, :dateCreated, :state,  :lg, :address)";
									$f = $dbn->prepare($sql);
									$added = time();
									$mcrypto = new mcrypt();
									$cashier = $mcrypto->mCryptThis(time()."-".rand(1000,200000));
									$type = "outlet";
									$f->bindParam(':name', $name);
									$f->bindParam(':email', $email);
									$f->bindParam(':phone', $phone);
									$f->bindParam(':password', $password);
									$f->bindParam(':username', $username);
									$f->bindParam(':dateCreated', $added);
									$f->bindParam(':state', $state);
									$f->bindParam(':lg', $lg);
									$f->bindParam(':address', $address);
									$f->execute();
									$f = new db();									
									$g = '{"error":{"message":"", "status":"0"}, "success":{"message":"Distributor was successfully added", "status":"200"}, "content":{}}';									
								}else{
									$g = '{"error":{"message":"Sorry, the phone number exists", "status":"1"}}';		
								}
							}else{
								$g = '{"error":{"message":"Sorry, the email exists", "status":"1"}}';	
							}
						}else{
							$g = '{"error":{"message":"Phone Number is invalid", "status":"1"}}';
						}
					}else{
						$g = '{"error":{"message":"All the required parameters are not found", "status":"1"}}';
					}
				}else{
					$g = '{"error":{"message":"Username is invalid", "status":"1"}}';
				}
				}else{
					$g = '{"error":{"message":"The Auth profile have not been found", "status":"1"}}';
				}
			}else{
				$g = '{"error":{"message":"The staff profile have not been found", "status":"1"}}';
			}
		}catch(PDOException $e){
			$dbn = new db();
			$e = $dbn->cleanException($e->getMessage());
			$g = '{"error":{"message":"An error:'.$e.' Ocurred", "status":"1"}}';
		}
	}else{
		$g = '{"error":{"message":"The parameter is not a valid object", "status":"1"}}';
	}
	$dbn = new db();
	return $dbn->responseFormat($resp,$g);
});

$app->post('/api/dist/create/arrival', function(Request $req, Response $resp){
	$json = $req->getParsedBody();
	$json = isset($json)? $json : $req->getBody();
	$dbn = new db();
	$validJson = $dbn->jsonFormat($json);
	if(!($validJson === NULL)){
		try{
			$data = $validJson->data;
			if(isset($data->username) and isset($data->publicKey)){
				if($dbn->isExistV2("select*from distributors where username = ? and publicKey = ?", array($data->username, $data->publicKey))){
					if(strlen($data->name) > 5){
						$q = "insert into bulkTrans (transDate, distID, product, count, shipmentID) VALUES (:transDate, :distID, :product, :count, :shipmentID)";
						$mcrypto = new mcrypt();
						$merchantID = $mcrypto->mCryptThis(time()."/".rand(1000,200000));
						$Qin = $dbn->connect();
						$f = $Qin->prepare($q);
						$date = time();
						$f->bindParam(":transDate", $date);
						$f->bindParam(":distID", $data->distID);
						$f->bindParam(":product", $data->product);
						$f->bindParam(":count", $data->count);
						$f->bindParam(":shipmentID", $data->shipmentID);
						$f->execute();
						$g = '{"error":{"message":"", "status":"0"},"success":{"message":"New Shipment created","status":"200"}, "content":{}}';
					}else{
						$g = '{"error":{"message":"All Profile fields are required", "status":"1"}}';
					}
				}else{
					$g = '{"error":{"message":"The Auth profile have not been found", "status":"1"}}';
				}
			}else{
				$g = '{"error":{"message":"The staff profile have not been found", "status":"1"}}';
			}
		}catch(PDOException $e){
			$e = $dbn->cleanException($e->getMessage());
			$g = '{"error":{"message":"An error:'.$e.' Ocurred", "status":"1"}}';
		}
	}else{
		$g = '{"error":{"message":"The parameter is not a valid object", "status":"1"}}';
	}
	return $dbn->responseFormat($resp,$g);
});

$app->post('/api/dist/create/transactions', function(Request $req, Response $resp){
	$json = $req->getParsedBody();
	$json = isset($json)? $json : $req->getBody();
	$dbn = new db();
	$validJson = $dbn->jsonFormat($json);
	if(!($validJson === NULL)){
		try{
			$data = $validJson->data;
			if(isset($data->username) and isset($data->publicKey)){
				if($dbn->isExistV2("select*from distributors where username = ? and publicKey = ?", array($data->username, $data->publicKey))){
					if(strlen($data->name) > 5){
						$q = "insert into order (transDate, distID, product, count, retID) VALUES (:transDate, :distID, :product, :count, :retID)";
						$mcrypto = new mcrypt();
						$merchantID = $mcrypto->mCryptThis(time()."/".rand(1000,200000));
						$Qin = $dbn->connect();
						$f = $Qin->prepare($q);
						$date = time();
						$f->bindParam(":transDate", $date);
						$f->bindParam(":distID", $data->distID);
						$f->bindParam(":product", $data->product);
						$f->bindParam(":count", $data->count);
						$f->bindParam(":retID", $data->retID);
						$f->execute();
						$g = '{"error":{"message":"", "status":"0"},"success":{"message":"New  created","status":"200"}, "content":{}}';
					}else{
						$g = '{"error":{"message":"All Profile fields are required", "status":"1"}}';
					}
				}else{
					$g = '{"error":{"message":"The Auth profile have not been found", "status":"1"}}';
				}
			}else{
				$g = '{"error":{"message":"The staff profile have not been found", "status":"1"}}';
			}
		}catch(PDOException $e){
			$e = $dbn->cleanException($e->getMessage());
			$g = '{"error":{"message":"An error:'.$e.' Ocurred", "status":"1"}}';
		}
	}else{
		$g = '{"error":{"message":"The parameter is not a valid object", "status":"1"}}';
	}
	return $dbn->responseFormat($resp,$g);
});

$app->post('/api/any/create/retailer', function(Request $req, Response $resp){
	$json = $req->getParsedBody();
	$json = isset($json)? $json : $req->getBody();
	$dbn = new db();
	$validJson = $dbn->jsonFormat($json);
	if(!($validJson === NULL)){
		try{
			$data = $validJson->data;
			if(true){
				if(true){
					$name = $data->name;
					$phone = $data->phone;
					$address = $data->address;
					$state = $data->state;
					$lg = $data->lg;
					$key = ' FitSKchgoHOOKing666';
					$string = $key.'34iIlm'.$password.'io9m-';
					$encryptedPassword = hash('sha256', $string);
					if(isset($username) and !$dbn->isExistV2("select*from distributors where username = ?", array($username))){
					if(isset($name) and isset($phone)){
						if(is_numeric($phone)){
							if(true){
								if(!$dbn->isExistV2("select*from retailer where phone = ?", array($phone))){
									$dbn = $dbn->connect();
									$sql = "INSERT INTO retailer (fullname, address, state, lg, phone, dateCreated) VALUES (:fullname, :address, :state, :lg, :phone, :dateCreated)";
									$f = $dbn->prepare($sql);
									$added = time();
									$f->bindParam(':fullname', $name);
									$f->bindParam(':address', $email);
									$f->bindParam(':state', $phone);
									$f->bindParam(':dateCreated', $added);
									$f->bindParam(':state', $state);
									$f->bindParam(':lg', $lg);
									$f->bindParam(':address', $address);
									$f->execute();
									$f = new db();									
									$g = '{"error":{"message":"", "status":"0"}, "success":{"message":"Distributor was successfully added", "status":"200"}, "content":{}}';									
								}else{
									$g = '{"error":{"message":"Sorry, the phone number exists", "status":"1"}}';		
								}
							}else{
								$g = '{"error":{"message":"Sorry, the email exists", "status":"1"}}';	
							}
						}else{
							$g = '{"error":{"message":"Phone Number is invalid", "status":"1"}}';
						}
					}else{
						$g = '{"error":{"message":"All the required parameters are not found", "status":"1"}}';
					}
				}else{
					$g = '{"error":{"message":"Username is invalid", "status":"1"}}';
				}
				}else{
					$g = '{"error":{"message":"The Auth profile have not been found", "status":"1"}}';
				}
			}else{
				$g = '{"error":{"message":"The staff profile have not been found", "status":"1"}}';
			}
		}catch(PDOException $e){
			$dbn = new db();
			$e = $dbn->cleanException($e->getMessage());
			$g = '{"error":{"message":"An error:'.$e.' Ocurred", "status":"1"}}';
		}
	}else{
		$g = '{"error":{"message":"The parameter is not a valid object", "status":"1"}}';
	}
	$dbn = new db();
	return $dbn->responseFormat($resp,$g);
});

$app->get('/api/fmcg/get/dist/{state}/{lg}', function(Request $req, Response $resp){
	$headers = $req->getHeaders();
	$state = $req->getAttribute("state");
	$lg = $req->getAttribute("lg");
	if (array_key_exists('HTTP_PUBLICKEY', $headers) and array_key_exists('HTTP_USERNAME', $headers)) {
        $publicKey  = $headers['HTTP_PUBLICKEY'][0];
        $username  = $headers['HTTP_USERNAME'][0];
		try{
			$dbn = new db();
			$sQ = "";
			if($dbn->isExistV2("select*from fmcg where username = ? and publicKey = ?", array($username, $publicKey))){
				$db = $dbn->connect();
				$binds = array();
				if($state == "-"){  } else { $sQ = " where state = ?"; array_push($binds, $state); }
				if(is_numeric($state) and $lg != "-"){ $sQ = $sQ." and lg = ?"; array_push($binds, $lg); }
				$sql = "SELECT name, address, phone, email, state, lg, username from distributors ".$sQ;
				$data = $dbn->selectFromQueryV2($sql, $binds);
				$g = '{"error":{"message":"","status":"0"}, "success":{"message":"data grabbed","code":"200"}, "content":{"data":'.$data.'}}';
			}else{
				$g = '{"error":{"message":"Username and key does not match any User", "status":"1"}}';
			}
		}catch(PDOException $ex){
			$g = '{"error":{"message":"'.$ex->getMessage().'", "status":"1"}}';
		}
	}else{
		$g = '{"error":{"message":"Priori not found. Credentials are required", "status":"1"}}';
	}
	$dbn = new db();
	return $dbn->responseFormat($resp,$g);
});

$app->get('/api/fmcg/get/retailer/{state}/{lg}', function(Request $req, Response $resp){
	$headers = $req->getHeaders();
	$state = $req->getAttribute("state");
	$lg = $req->getAttribute("lg");
	if (array_key_exists('HTTP_PUBLICKEY', $headers) and array_key_exists('HTTP_USERNAME', $headers)) {
        $publicKey  = $headers['HTTP_PUBLICKEY'][0];
        $username  = $headers['HTTP_USERNAME'][0];
		try{
			$dbn = new db();
			$sQ = "";
			if($dbn->isExistV2("select*from fmcg where username = ? and publicKey = ?", array($username, $publicKey))){
				$db = $dbn->connect();
				$binds = array();
				if($state == "-"){  } else { $sQ = " where state = ?"; array_push($binds, $state); }
				if(is_numeric($state) and $lg != "-"){ $sQ = $sQ." and lg = ?"; array_push($binds, $lg); }
				$sql = "SELECT fullname, address, phone, state, lg from retailer ".$sQ;
				$data = $dbn->selectFromQueryV2($sql, $binds);
				$g = '{"error":{"message":"","status":"0"}, "success":{"message":"data grabbed","code":"200"}, "content":{"data":'.$data.'}}';
			}else{
				$g = '{"error":{"message":"Username and key does not match any User", "status":"1"}}';
			}
		}catch(PDOException $ex){
			$g = '{"error":{"message":"'.$ex->getMessage().'", "status":"1"}}';
		}
	}else{
		$g = '{"error":{"message":"Priori not found. Credentials are required", "status":"1"}}';
	}
	$dbn = new db();
	return $dbn->responseFormat($resp,$g);
});

$app->get('/api/fmcg/get/shipment/{state}', function(Request $req, Response $resp){
	$headers = $req->getHeaders();
	$state = $req->getAttribute("state");
	$lg = $req->getAttribute("lg");
	if (array_key_exists('HTTP_PUBLICKEY', $headers) and array_key_exists('HTTP_USERNAME', $headers)) {
        $publicKey  = $headers['HTTP_PUBLICKEY'][0];
        $username  = $headers['HTTP_USERNAME'][0];
		try{
			$dbn = new db();
			$sQ = "";
			if($dbn->isExistV2("select*from fmcg where username = ? and publicKey = ?", array($username, $publicKey))){
				$db = $dbn->connect();
				$binds = array();
				if($state == "-"){  } else { $sQ = " where state = ?"; array_push($binds, $state); }
				$sql = "SELECT * from shipments ".$sQ;
				$data = $dbn->selectFromQueryV2($sql, $binds);
				$g = '{"error":{"message":"","status":"0"}, "success":{"message":"data grabbed","code":"200"}, "content":{"data":'.$data.'}}';
			}else{
				$g = '{"error":{"message":"Username and key does not match any User", "status":"1"}}';
			}
		}catch(PDOException $ex){
			$g = '{"error":{"message":"'.$ex->getMessage().'", "status":"1"}}';
		}
	}else{
		$g = '{"error":{"message":"Priori not found. Credentials are required", "status":"1"}}';
	}
	$dbn = new db();
	return $dbn->responseFormat($resp,$g);
});

$app->get('/api/fmcg/get/transactions/{V}/{type}/{id}/{from}/{to}/{product}', function(Request $req, Response $resp){
	$headers = $req->getHeaders();
	$type = $req->getAttribute("type");
	$id = $req->getAttribute("id");
	$from = $req->getAttribute("from");
	$to = ($req->getAttribute("to") > time())? time() + 86399 : $req->getAttribute("to") + 86399;
	$product = $req->getAttribute("product");
	$v = $req->getAttribute("V");
	$state = $req->getAttribute("state");
	$lg = $req->getAttribute("lg");
	if (array_key_exists('HTTP_PUBLICKEY', $headers) and array_key_exists('HTTP_USERNAME', $headers)) {
        $publicKey  = $headers['HTTP_PUBLICKEY'][0];
        $username  = $headers['HTTP_USERNAME'][0];
		try{
			$dbn = new db();
			$sQ = "";
			if($dbn->isExistV2("select*from fmcg where username = ? and publicKey = ?", array($username, $publicKey))){
				$db = $dbn->connect();
				if($v == 0){
					$binds = array($id, $from, $to);
					if($type == "dist"){
						$sQ = " where bulkTrans.distID = ? and transDate >= ? and transDate <= ?";
						if($product == "-"){  } else { $sQ = $sQ." and product = ?"; array_push($binds, $product); }
						$sql = "SELECT bulkTrans.*, product.name as productName  from bulkTrans left join product on product.id = bulkTrans.product ".$sQ;					
						$data = $dbn->selectFromQueryV2($sql, $binds);
						$g = '{"error":{"message":"","status":"0"}, "success":{"message":"data grabbed","code":"200"}, "content":{"data":'.$data.'}}';
					}elseif($type == "ret"){
						$sQ = " where `order`.distID = ? and transDate >= ? and transDate <= ? ";
						if($product == "-"){  } else { $sQ = $sQ." and product = ?"; array_push($binds, $product); }
						$sql = "SELECT tmp.*, distributors.name from (SELECT `order`.*, product.name as productName from `order` left join product on product.id = `order`.product ".$sQ.") as tmp left join distributors on distributors.username = tmp.distID";
						$data = $dbn->selectFromQueryV2($sql, $binds);
						$g = '{"error":{"message":"","status":"0"}, "success":{"message":"data grabbed","code":"200"}, "content":{"data":'.$data.'}}';
					}
				}else{
					$binds = array($from, $to);
					if($type == "dist"){
						$sQ = " where transDate >= ? and transDate <= ?";
						if($product == "-"){  } else { $sQ = " and product = ?"; array_push($binds, $product); }
						$sql = "SELECT bulkTrans.*, product.name as productName  from bulkTrans left join product on product.id = bulkTrans.product ".$sQ;					
						$data = $dbn->selectFromQueryV2($sql, $binds);
						$g = '{"error":{"message":"","status":"0"}, "success":{"message":"data grabbed","code":"200"}, "content":{"data":'.$data.'}}';
					}elseif($type == "ret"){
						$sQ = " where transDate >= ? and transDate <= ?";
						if($product == "-"){  } else { $sQ = " and product = ?"; array_push($binds, $product); }
						$sql = "SELECT tmp.*, distributors.name from (SELECT order.*, product.name as productName  from order left join product on product.id = order.product ".$sQ.") as tmp left join distributors on distributors.username = tmp.distID";		
						$data = $dbn->selectFromQueryV2($sql, $binds);
						$g = '{"error":{"message":"","status":"0"}, "success":{"message":"data grabbed","code":"200"}, "content":{"data":'.$data.'}}';
					}
				}
			}else{
				$g = '{"error":{"message":"Username and key does not match any User", "status":"1"}}';
			}
		}catch(PDOException $ex){
			$g = '{"error":{"message":"'.$ex->getMessage().'", "status":"1"}}';
		}
	}else{
		$g = '{"error":{"message":"Priori not found. Credentials are required", "status":"1"}}';
	}
	$dbn = new db();
	return $dbn->responseFormat($resp,$g);
});

$app->get('/api/fmcg/get/dashboard/{from}/{to}/{product}', function(Request $req, Response $resp){
	$headers = $req->getHeaders();
	$from = $req->getAttribute("from");
	$to = ($req->getAttribute("to") > time())? time() + 86399 : $req->getAttribute("to") + 86399;
	$product = $req->getAttribute("product");
	if (array_key_exists('HTTP_PUBLICKEY', $headers) and array_key_exists('HTTP_USERNAME', $headers)) {
        $publicKey  = $headers['HTTP_PUBLICKEY'][0];
        $username  = $headers['HTTP_USERNAME'][0];
		try{
			$dbn = new db();
			$sQ = "";
			if($dbn->isExistV2("select*from fmcg where username = ? and publicKey = ?", array($username, $publicKey))){
				$db = $dbn->connect();
				$binds = array($from, $to);
				$sQ = " where transDate >= ? and transDate <= ?";
				if($product == "-"){  } else { $sQ = $sQ." and product = ?"; array_push($binds, $product); }
				$sql = "select sum(counts) as torder, code, name from (select `count` as counts, state from bulkTrans left join distributors on distributors.username = bulkTrans.distID ".$sQ." ) as tmp left join state on state.id = tmp.state GROUP BY code order by torder desc";
				$data = $dbn->selectFromQueryV2($sql, $binds);
				$sql2 = "select count(distributors.id) as distCount, distributors.state as stateID, code from distributors left join state on state.id = distributors.state group by state";
				$data2 = $dbn->selectFromQueryV2($sql2);
				$sql3 = "select count(retailer.id) as retCount, retailer.state as stateID, code from retailer left join state on state.id = retailer.state group by state";
				$data3 = $dbn->selectFromQueryV2($sql3);
				$g = '{"error":{"message":"","status":"0"}, "success":{"message":"data grabbed","code":"200"}, "content":{"data":'.$data.', "distributors":'.$data2.', "retailers":'.$data3.'}}';
			}else{
				$g = '{"error":{"message":"Username and key does not match any User", "status":"1"}}';
			}
		}catch(PDOException $ex){
			$g = '{"error":{"message":"'.$ex->getMessage().'", "status":"1"}}';
		}
	}else{
		$g = '{"error":{"message":"Priori not found. Credentials are required", "status":"1"}}';
	}
	$dbn = new db();
	return $dbn->responseFormat($resp,$g);
});

$app->get('/api/populate/dist', function(Request $req, Response $resp){
	$headers = $req->getHeaders();
	$dbn = new db();
	$t = $dbn->selectFromQueryV2("select * from state order by random() limit 12");
	$t = json_decode($t);
	$db = $dbn->connect();
	for($i = 0; $i < count($t); $i++){
		$sql = "INSERT INTO distributors (name, email, phone, password, username, dateCreated, state, lg, address) SELECT :name, :email, :phone, :password, :username, :dateCreated, :state,  id, :address FROM  lgs where stateID = :state order by id desc limit 1";
		$f = $db->prepare($sql);
		$added = time();
		$username = rand(1000,200000);
		$name = ucfirst($dbn->genID(rand(4, 9))) ." ".ucfirst($dbn->genID(rand(4, 9)));
		$phone = rand(100000,999999990);
		$password = rand(1000,99999990);
		$key = ' FitSKchgoHOOKing666';
		$string = $key.'34iIlm'.$password.'io9m-';
		$encryptedPassword = hash('sha256', $string);
		$f->bindParam(':name', $name);
		$f->bindParam(':email', $email);
		$f->bindParam(':phone', $phone);
		$f->bindParam(':password', $encryptedPassword);
		$f->bindParam(':username', $username);
		$f->bindParam(':dateCreated', $added);
		$f->bindParam(':state', $t[$i]->id);
		$f->bindParam(':address', $address);
		$f->execute();
	}
	$g = '{"error":{"message":"","status":"0"}, "success":{"message":"Data grabbed","code":"200"}, "content":{}}';
	return $dbn->responseFormat($resp,$g);
});

$app->get('/api/populate/ret', function(Request $req, Response $resp){
	$headers = $req->getHeaders();
	$dbn = new db();
	$t = $dbn->selectFromQueryV2("select * from state order by random() limit 12");
	$t = json_decode($t);
	$db = $dbn->connect();
	for($i = 0; $i < count($t); $i++){
		$sql = "INSERT INTO retailer (fullname, phone, dateCreated, state, lg, address) SELECT :name, :phone, :dateCreated, :state,  id, :address FROM  lgs where stateID = :state limit 1";
		$f = $db->prepare($sql);
		$added = time();
		$username = rand(1000,200000);
		$name = ucfirst($dbn->genID(rand(4, 9))) ." ".ucfirst($dbn->genID(rand(4, 9)));
		$phone = rand(100000,999999990);
		$password = rand(1000,99999990);
		$key = ' FitSKchgoHOOKing666';
		$string = $key.'34iIlm'.$password.'io9m-';
		$encryptedPassword = hash('sha256', $string);
		$f->bindParam(':name', $name);
		$f->bindParam(':phone', $phone);
		$f->bindParam(':dateCreated', $added);
		$f->bindParam(':state', $t[$i]->id);
		$f->bindParam(':address', $address);
		$f->execute();
	}
	$g = '{"error":{"message":"","status":"0"}, "success":{"message":"Data grabbed","code":"200"}, "content":{}}';
	return $dbn->responseFormat($resp,$g);
});

$app->get('/api/populate/bulkord', function(Request $req, Response $resp){
	$headers = $req->getHeaders();
	$dbn = new db();
	$t = $dbn->selectFromQueryV2("select * from distributors");
	$t = json_decode($t);
	$product = $dbn->selectFromQueryV2("select * from product");
	$product = json_decode($product);
	$db = $dbn->connect();
	for($i = 0; $i < count($t); $i++){
		$sql = "INSERT INTO bulkTrans (distID, product, transDate, count) VALUES (:distID, :product, :transDate, :count)";
		$f = $db->prepare($sql);
		$added = time();
		$distID = $t[$i]->username;
		$prod = $product[rand(0, count($product) -1)]->id;
		$orders = rand(50,2000);
		$f->bindParam(':distID', $distID);
		$f->bindParam(':product', $prod);
		$f->bindParam(':transDate', $added);
		$f->bindParam(':count', $orders);
		$f->execute();
	}
	$g = '{"error":{"message":"","status":"0"}, "success":{"message":"Data grabbed","code":"200"}, "content":{}}';
	return $dbn->responseFormat($resp,$g);
});

$app->get('/api/any/get/products', function(Request $req, Response $resp){
	$headers = $req->getHeaders();
	$search = "-";
	$dbn = new db();
	$sql = "select * from product";
	$data = $dbn->selectFromQueryV2($sql);
	$g = '{"error":{"message":"","status":"0"}, "success":{"message":"Data grabbed","code":"200"}, "content":{"data":'.$data.'}}';
	return $dbn->responseFormat($resp,$g);
});

















$app->get('/api/get/states', function(Request $req, Response $resp){
	$dbn = new db();
	$data = $dbn->selectFromQueryV2("select*from state");
	$g = '{"error":{"message":"","status":"0"}, "success":{"message":"data grabbed","code":"200"}, "content":{"data":'.$data.'}}';
	return $dbn->responseFormat($resp,$g);
});
$app->get('/api/get/lgs/{stateID}', function(Request $req, Response $resp){
	$stateID = $req->getAttribute('stateID');
	$dbn = new db();
	if(is_numeric($stateID)){
		$data = $dbn->selectFromQueryV2("select*from lgs where stateID = ?", array($stateID));
		$g = '{"error":{"message":"","status":"0"}, "success":{"message":"data grabbed","code":"200"}, "content":{"data":'.$data.'}}';
	}else{
		$g = '{"error":{"message":"","status":"0"}, "success":{"message":"data grabbed","code":"200"}, "content":{"data":[]}}';
	}
	return $dbn->responseFormat($resp,$g);
});

$app->options('/{routes:.+}', function ($request, $response, $args) {
	$g = '{"error":{"message":"The Method may not have been implemented", "status":"1"}}';
	return $response
	->withStatus(200)
	->withHeader('Content-Type', 'application/json')
	->withHeader('Access-Control-Allow-Origin', '*')
	->withHeader('Access-Control-Allow-Headers', array('Content-Type', 'X-Requested-With', 'Authorization', 'username', 'someValue', 'someValue', 'publicKey', 'PI'))
	->withHeader('Access-Control-Allow-Methods', array('GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'))
   	->write($g);
});





?>