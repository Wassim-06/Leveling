<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class QuetesController extends AbstractController
{
    #[Route('/quetes', name: 'quetes')]
    public function index(): Response
    {
        return $this->render("pages/quetes.html.twig");
    }
}
