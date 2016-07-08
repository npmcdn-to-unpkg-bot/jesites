<!DOCTYPE html>
<html>
<head>
  <title>JESAMPLES</title>
  <link href='https://fonts.googleapis.com/css?family=Quicksand:400,700' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" href="css/main.css" />

</head>
<body>

  <header>
    <h1>JESamples</h1>
  </header>

  <div class="container">
    <nav>
      <ul>
        <li>HTML5</li>
        <li>JS</li>
        <li>AngularJS</li>
        <li>NodeJS</li>
      </ul>
    </nav>

    <main>
      <div class="sitelist">
      </div>
    </main>
  </div>

  <footer>
    <ul>
      <li>&copy; jesidea.com</li>
    </ul>
  </footer>

  <div class="overlay">
    <img src="img/loader.gif">
    <br>
    loading samples...
  </div>

  <script src="js/vendor/jquery.js"></script>
  <script src="js/vendor/lodash.min.js"></script>
  <script src="js/main.js"></script>

  <?php include_once('./includes/html_templates.inc');?>

</body>
</html>
