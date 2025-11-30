<?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        $my_student_email = "mohamed.arfaoui@etu.univ-smb.fr"; 
        $recipient = "mohamed.arfaoui@etu.univ-smb.fr, arfaoumo@iut-acy.univ-smb.fr, yassin.arfaouii@gmail.com";

        $name = strip_tags(trim($_POST["name"]));
        $visitor_email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $message = trim($_POST["message"]);

        if (empty($name) OR empty($message) OR !filter_var($visitor_email, FILTER_VALIDATE_EMAIL)) 
        {
            header("Location: index.html?status=error#contact");
            exit;
        }

        $subject = "Portfolio: Message from $name";

        $email_content = "Name: $name\n";
        $email_content .= "Contact email: $visitor_email\n";
        $email_content .= "-------------------------\n";
        $email_content .= "Message:\n$message\n";

        $headers = "From: $my_student_email\r\n";
        $headers .= "Reply-To: $visitor_email\r\n";

        if (mail($recipient, $subject, $email_content, $headers, "-f" . $my_student_email)) 
        {
            header("Location: index.html?status=success#contact");
        } 
        else 
        {
            header("Location: index.html?status=server_error#contact");
        }

    } 
    else 
    {
        header("Location: index.html");
    }
?>