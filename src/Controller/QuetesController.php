<?php

namespace App\Controller;

use App\Repository\TaskRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class QuetesController extends AbstractController
{
    /**
     * 
     * @var TaskRepository
     */
    private $repository;

    /**
     * 
     * @param TaskRepository $repository
     */
    public function __construct(TaskRepository $repository)
    {
        $this->repository = $repository;
    }

    #[Route('/quetes', name: 'quetes')]
    public function index(): Response
    {
        $tasks = $this->repository->findAllOrderBy('id', 'DESC');
        return $this->render("pages/quetes.html.twig", [
            'tasks' => $tasks
        ]);
    }

    #[Route('/quetes/tri/{champ}/{ordre}', name: 'quetes.tri')]
    public function tri($champ, $ordre): Response
    {
        $tasks = $this->repository->findAllOrderBy($champ, $ordre);
        return $this->render("pages/quetes.html.twig", [
            'tasks' => $tasks
        ]);
    }

    #[Route('/quetes/filtre/{champ}', name: 'quetes.filtre')]
    public function filtre($champ, Request $request): Response
    {
        $valeur = $request->get("recherche");
        $tasks = $this->repository->findByEqualValue($champ, $valeur);
        return $this->render("pages/quetes.html.twig", [
            'tasks' => $tasks
        ]);
    }

    #[Route('/quetes/checked/{id}', name: 'task.update', methods: ['POST'])]
    public function updateTask($id): Response
    {
        $this->repository->updateTask($id, true);

        return $this->redirectToRoute('quetes');
    }
}
