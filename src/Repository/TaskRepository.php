<?php

namespace App\Repository;

use App\Entity\Task;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Task>
 */
class TaskRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Task::class);
    }

    /**
     * Tri en fonction du champ et de l'ordre(ASC ou DESC)
     */
    public function findAllOrderBy($champ, $ordre): array
    {
        return $this->createQueryBuilder('t')
            ->orderBy('t.' . $champ, $ordre)
            ->getQuery()
            ->getResult();
    }

    /**
     * Obtient tout les résultat égal a la valeur et au champ
     */
    public function findByEqualValue($champ, $valeur): array
    {
        if ($valeur == "") {
            return $this->createQueryBuilder('t')
                ->orderBy('t.' . $champ, 'ASC')
                ->getQuery()
                ->getResult();
        } else {
            return $this->createQueryBuilder('t')
                ->where('t.' . $champ . '=:valeur')
                ->setParameter('valeur', $valeur)
                ->orderBy('t.' . $champ, 'DESC')
                ->getQuery()
                ->getResult();
        }
    }
}
