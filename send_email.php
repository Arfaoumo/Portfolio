<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $mon_email_etudiant = "mohamed.arfaoui@etu.univ-smb.fr"; 
    $destinataire = "mohamed.arfaoui@etu.univ-smb.fr";

    $nom = strip_tags(trim($_POST["name"]));
    $email_visiteur = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    if (empty($nom) OR empty($message) OR !filter_var($email_visiteur, FILTER_VALIDATE_EMAIL)) {
        header("Location: index.html?status=error#contact");
        exit;
    }

    $sujet = "Portfolio : Message de $nom";

    $contenu_email = "Nom : $nom\n";
    $contenu_email .= "Email du contact : $email_visiteur\n";
    $contenu_email .= "-------------------------\n";
    $contenu_email .= "Message :\n$message\n";

    $headers = "From: $mon_email_etudiant\r\n";
    $headers .= "Reply-To: $email_visiteur\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    if (mail($destinataire, $sujet, $contenu_email, $headers, "-f" . $mon_email_etudiant)) {
        header("Location: index.html?status=success#contact");
    } else {
        header("Location: index.html?status=server_error#contact");
    }

} 
else {
    header("Location: index.html");
}
?>