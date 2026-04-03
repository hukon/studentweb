<?php
// export_student_eval_pdf.php
require('fpdf/fpdf.php');

function utf8_to_latin($text) {
    if ($text === null) return '';
    $out = @iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text);
    if ($out !== false) return $out;
    return @utf8_decode($text);
}

require_once __DIR__ . '/config.php';
requireLogin();

if (!isset($_GET['student_id']) || intval($_GET['student_id']) <= 0) {
    die("ID étudiant manquant ou invalide.");
}
$student_id = intval($_GET['student_id']);

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    die("Erreur de connexion.");
}
$conn->set_charset("utf8mb4");

// Fetch student data and evaluation
$query = "SELECT s.name as student_name, s.dob, c.name as class_name, e.* 
          FROM students s 
          LEFT JOIN classes c ON s.class_id = c.id
          LEFT JOIN evaluations e ON s.id = e.student_id
          WHERE s.id = ?";
          
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Étudiant non trouvé.");
}

$data = $result->fetch_assoc();
$stmt->close();
$conn->close();

if (empty($data['global_mastery'])) {
    die("L'évaluation de cet étudiant n'est pas encore complète pour générer un relevé (nécessite l'évaluation des 4 compétences).");
}

class PDF extends FPDF {
    // Colors and details
    function Header() {
        $this->SetFillColor(240, 248, 255);
        $this->Rect(0, 0, 210, 40, 'F');
        $this->SetFont('Arial','B',16);
        $this->SetTextColor(30, 60, 114);
        $this->Cell(0,12,utf8_to_latin('Releve d\'Evaluation des Acquis - 1AM'),0,1,'C');
        $this->SetFont('Arial','I',11);
        $this->SetTextColor(100, 100, 100);
        $this->Cell(0,6,utf8_to_latin('Ministere de l\'Education Nationale'),0,1,'C');
        $this->Ln(15);
    }
    function Footer() {
        $this->SetY(-20);
        $this->SetFont('Arial','I',8);
        $this->SetTextColor(150, 150, 150);
        $this->Cell(0,10,'Plateforme Educative - Page '.$this->PageNo().' - Genere le '.date('d/m/Y'),0,0,'C');
    }
    
    function SectionTitle($icon, $title) {
        $this->Ln(6);
        $this->SetFont('Arial','B',11);
        $this->SetFillColor(235, 245, 255);
        $this->SetTextColor(40, 40, 80);
        $this->Cell(0,10,'   '.utf8_to_latin($icon . ' ' . $title),0,1,'L',true);
        $this->Ln(2);
    }
    
    function EvaluationRow($label, $mark) {
        $this->SetFont('Arial','',10);
        $this->SetTextColor(50, 50, 50);
        $this->Cell(150, 8, '  '.utf8_to_latin($label), 'B', 0, 'L');
        
        $this->SetFont('Arial','B',10);
        if ($mark == 'A') $this->SetTextColor(16, 185, 129); // Green
        elseif ($mark == 'B') $this->SetTextColor(59, 130, 246); // Blue
        elseif ($mark == 'C') $this->SetTextColor(245, 158, 11); // Orange
        elseif ($mark == 'D') $this->SetTextColor(239, 68, 68); // Red
        else $this->SetTextColor(150, 150, 150);
        
        $this->Cell(40, 8, $mark ? $mark : '-', 'B', 1, 'C');
        $this->SetTextColor(0);
    }
}

$pdf = new PDF('P','mm','A4');
$pdf->AddPage();

// Student info Box
$pdf->SetFillColor(250, 250, 252);
$pdf->SetDrawColor(220, 225, 235);
$pdf->Rect(10, 45, 190, 25, 'DF');

$pdf->SetXY(15, 48);
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(100, 100, 100);
$pdf->Cell(20, 6, 'Eleve: ', 0, 0);
$pdf->SetFont('Arial','B',12);
$pdf->SetTextColor(30, 40, 50);
$pdf->Cell(90, 6, utf8_to_latin($data['student_name']), 0, 0);

$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(100, 100, 100);
$pdf->Cell(20, 6, 'Classe: ', 0, 0);
$pdf->SetFont('Arial','',11);
$pdf->SetTextColor(30, 40, 50);
$pdf->Cell(40, 6, utf8_to_latin($data['class_name']), 0, 1);

$pdf->SetX(15);
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(100, 100, 100);
$pdf->Cell(20, 6, 'Date: ', 0, 0);
$pdf->SetFont('Arial','',11);
$pdf->SetTextColor(30, 40, 50);
$pdf->Cell(90, 6, date('d/m/Y', strtotime($data['evaluated_date'])), 0, 0);

$pdf->Ln(15);

// Oral
$pdf->SectionTitle("~", "Comprehension et Communication Orales");
$pdf->EvaluationRow("Identifier le theme de la situation de communication", $data['oral_1']);
$pdf->EvaluationRow("Identifier les unites de sens", $data['oral_2']);
$pdf->EvaluationRow("S'exprimer en fonction de la situation de communication", $data['oral_3']);

// Lecture
$pdf->SectionTitle(">>", "Lecture");
$pdf->EvaluationRow("Activer la correspondance graphie/phonie", $data['reading_1']);
$pdf->EvaluationRow("Realiser une lecture fluide", $data['reading_2']);
$pdf->EvaluationRow("Respecter l'intonation", $data['reading_3']);

// Comprehension
$pdf->SectionTitle("?", "Comprehension de l'Ecrit");
$pdf->EvaluationRow("Identifier le theme general du texte", $data['comp_1']);
$pdf->EvaluationRow("Identifier le champ lexical relatif au theme", $data['comp_2']);
$pdf->EvaluationRow("Reperer des informations", $data['comp_3']);

// Production Ecrite
$pdf->SectionTitle("+", "Production Ecrite");
$pdf->EvaluationRow("Pertinence du texte produit", $data['prod_1']);
$pdf->EvaluationRow("Coherence du texte produit", $data['prod_2']);
$pdf->EvaluationRow("Correction de la langue", $data['prod_3']);
$pdf->EvaluationRow("Lisibilite de l'ecrit", $data['prod_4']);

$pdf->Ln(12);

// Mastery Result Box
$pdf->SetFillColor(255, 253, 240);
$pdf->SetDrawColor(240, 220, 180);
$pdf->SetLineWidth(0.5);
$pdf->Rect(10, $pdf->GetY(), 190, 25, 'DF');
$pdf->SetLineWidth(0.2);

$pdf->SetY($pdf->GetY() + 8);
$pdf->SetX(15);
$pdf->SetFont('Arial','B',14);
$pdf->SetTextColor(80, 80, 80);
$pdf->Cell(60, 10, 'Maitrise globale : ', 0, 0);

if (strpos($data['global_mastery'], 'très') !== false) {
    $pdf->SetTextColor(16, 185, 129); 
    $pdf->SetFillColor(236, 253, 245);
} elseif (strpos($data['global_mastery'], 'satisfaisante') !== false && strpos($data['global_mastery'], 'peu') === false) {
    $pdf->SetTextColor(59, 130, 246);
    $pdf->SetFillColor(239, 246, 255);
} elseif (strpos($data['global_mastery'], 'peu') !== false) {
    $pdf->SetTextColor(245, 158, 11);
    $pdf->SetFillColor(254, 252, 232);
} elseif (strpos($data['global_mastery'], 'non') !== false) {
    $pdf->SetTextColor(239, 68, 68);
    $pdf->SetFillColor(254, 242, 242);
}

$pdf->SetFont('Arial','B',15);
$pdf->Cell(120, 10, utf8_to_latin($data['global_mastery'] ? strtoupper($data['global_mastery']) : 'NON DEFINIE'), 0, 1);
$pdf->SetTextColor(0);

$pdf->Ln(15);
$pdf->SetFont('Arial','',10);
$pdf->Cell(0, 10, 'Signature de l\'enseignant: ____________________', 0, 1, 'R');

$pdf->Output('I', 'Releve_' . preg_replace('/[^A-Za-z0-9_-]/','_', $data['student_name']) . '.pdf');
?>
