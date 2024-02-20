<?php
// $servername = "student.crru.ac.th";
// $username = "641413019";
// $password = "22160";
// $dbname = "641413019";

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "place";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
mysqli_set_charset($conn, "utf8");
?>