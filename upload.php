
<?php 

    $error = '';

    if (isset($_POST['submit'])) {
        $file_excel = 'sampledata.xlsx';

        // var_dump($_FILES["file"]);exit;

        if (!$_FILES["file"]["error"]) {
            $tmp_name = $_FILES["file"]["tmp_name"];
            if (file_exists('sampledata.xlsx')) {
                unlink('sampledata.xlsx');
                move_uploaded_file($tmp_name, 'sampledata.xlsx');
            } else {
                move_uploaded_file($tmp_name, 'sampledata.xlsx');
            }
        } else {
            $error = $_FILES["file"]["error"];
        }

        require('spreadsheet-reader-master/SpreadsheetReader.php');

        $start = microtime(true);

        $Reader = new SpreadsheetReader($file_excel);

        $data = array();

        foreach ($Reader as $Row)
        {
            array_push($data,$Row);
            // print_r($Row);
        }

        function _remove_empty_internal($value) {
          return !empty($value) || $value === 0;
        }

        function remove_empty($array) {
          return array_filter($array, '_remove_empty_internal');
        }

        $data = remove_empty($data);

        $arrData = $data;

        $data = json_encode($data,JSON_UNESCAPED_UNICODE);

        $fp = fopen('results.json', 'w+');
        fwrite($fp, $data);
        fclose($fp);
        

        function validateDate($date)
        {
            $d = DateTime::createFromFormat('d/m/Y', $date);
            return $d && $d->format('d/m/Y') == $date;
        }

        $arrDataType = array();
        $arrDataUnsetElementFirst = $arrData;
        $arrFirstRow = $arrDataUnsetElementFirst[0];
        unset($arrDataUnsetElementFirst[0]);
        //get data type of column
        foreach ($arrDataUnsetElementFirst as $key => $value) {
            foreach ($value as $key1 => $value1) {
                if ($value1) {
                    $temp = gettype($value1);
                    if ($temp == 'string' && is_double($temp)){
                        $temp = 'double';
                    }
                    if ($temp == 'string' && preg_match('/\d{2}-\d{2}-\d{2}/',$value1) || preg_match('/\d{2}-\d{2}-\d{4}/',$value1) || preg_match('/\d{2}\/\d{2}\/\d{2}/',$value1) || preg_match('/\d{2}\/\d{2}\/\d{4}/',$value1) || preg_match('/\d{2}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \d{2}/',$value1) || preg_match('/\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2} \d{2}/',$value1) || preg_match('/\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2} \d{2}/',$value1) || preg_match('/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2} \d{2}/',$value1) ) {
                        $temp = 'date';
                    }
                    $arrDataType[$key1 . '-' . $arrFirstRow[$key1]] = $temp;
                }
            }
        }


        $arrDataType = json_encode($arrDataType,JSON_UNESCAPED_UNICODE);

        $fp = fopen('datatype.json', 'w+');
        fwrite($fp, $arrDataType);
        fclose($fp);

        
        if (!$error) {
            $success = 'OK';
            header('Location: index.html');
        }
        

        // var_dump(microtime(true) - $start);
    }
        
?>




<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Upload file Excel</title>
    <link class="include" rel="stylesheet" type="text/css" href="css/bootstrap.min.css">

    
    <style>
        body {
            padding: 50px;
            /*width: 800px;*/
        }
        ul {
            list-style: none;
        }

        .ms-options-wrap button {
            font-size: 16px;
            color: #565656;
            font-weight: bold;
        }

    </style>
    
</head>
<body>


    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">Excel to Chart</a>
            </div>
            <div id="navbar" class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <li><a href="index.html">Home</a></li>
                    <li class="active"><a href="#">Upload</a></li>
                </ul>
            </div><!--/.nav-collapse -->
        </div>
    </nav>

    <div class="container">
        <div class="jumbotron">
            <?php if (!empty($success)) { ?>
                <div class="alert alert-success" role="alert">Upload success</div>
            <?php } ?>
            <?php if (!empty($error)) { ?>
                <div class="alert alert-danger" role="alert"><?php echo $error ?></div>
            <?php } ?>

            <h2>Upload file excel</h2>
            <form action="upload.php" method="POST" enctype="multipart/form-data">
                <div class="form-group">
                    <input class="form-control" type="file" name="file" />
                    <label>.xlsx, xls</label>
                </div>

                <div class="form-group">
                    <input class="btn btn-success" type="submit" name="submit" value="Upload" />
                </div>

            </form>
        </div>

    </div><!-- /.container -->
    
</body>
</html>

