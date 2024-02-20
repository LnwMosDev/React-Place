<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

// Include the database connection file
require_once 'connection.php';

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Retrieve the input data
$data = json_decode(file_get_contents("php://input"), true);

// Perform operations based on the request method
switch ($method) {
    case 'GET':

        $sqlupdatescore = "UPDATE place SET score = ( SELECT AVG(vote) FROM comment WHERE comment.id = place.id ) WHERE EXISTS ( SELECT 1 FROM comment WHERE comment.id = place.id)";
        $resultupdatescore = $conn->query($sqlupdatescore);
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $sql = "SELECT * FROM place WHERE id='$id'";
        } else {
            $sql = "SELECT * FROM place";
        }
        
        $result = $conn->query($sql);
        $response = array();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $comment_arr = array();
                $sqlcomment = "SELECT * FROM comment WHERE id=".$row['id'];
                $resultcomment = $conn->query($sqlcomment);
                
                while ($rowcomment = $resultcomment->fetch_assoc()) {
                    $comment_arr[$rowcomment['comment_id']] = array(
                        'comment_text' => $rowcomment['comment'],
                        'vote' => $rowcomment['vote']
                    );
                }
                
                $row['comment'] = $comment_arr;
                $response[] = $row;
            }
        } else {
            $response = array('status' => 'error', 'message' => 'No records found for the provided id');
        }

        echo json_encode($response);
        break;

    case 'POST':
        // Handle POST request to insert data
        // Example: Insert a new record into the "comment" table
        $id = $data['id'];
        $comment = $data['comment'];
        $vote = $data['rating'];


        $sql = "INSERT INTO comment (comment_id,comment,id,vote) VALUES ('', '$comment','$id','$vote')";

        if ($conn->query($sql) === TRUE) {
            $response = array('status' => 'success', 'message' => 'Record inserted successfully');
        } else {
            $response = array('status' => 'error', 'message' => 'Error inserting record: ' . $conn->error);
        }

        echo json_encode($response);
        break;
        

    case 'PUT':
        // Handle PUT request to update data
        // Example: Update a record in the "place" table
        $id = $data['id'];
        $name = $data['name'];
        $descript = $data['descript'];
        $img = $data['img'];
        $type = $data['type'];

        $sql = "UPDATE place SET name='$name', descript='$descript', img='$img', type='$type' WHERE id='$id'";

        if ($conn->query($sql) === TRUE) {
            $response = array('status' => 'success', 'message' => 'Record updated successfully');
        } else {
            $response = array('status' => 'error', 'message' => 'Error updating record: ' . $conn->error);
        }

        echo json_encode($response);
        break;

    case 'DELETE':
        // Handle DELETE request to delete data
        // Example: Delete a record from the "place" table
        $id = $data['id'];

        $sql = "DELETE FROM place WHERE id='$id'";

        if ($conn->query($sql) === TRUE) {
            $response = array('status' => 'success', 'message' => 'Record deleted successfully');
        } else {
            $response = array('status' => 'error', 'message' => 'Error deleting record: ' . $conn->error);
        }

        echo json_encode($response);
        break;

    default:
        // Invalid request method
        $response = array('status' => 'error', 'message' => 'Invalid request method');
        echo json_encode($response);
        break;
}
?>
