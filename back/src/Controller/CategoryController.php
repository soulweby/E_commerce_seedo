<?php

namespace App\Controller;

use App\Entity\Category;
use App\Form\CategoryType;
use App\Repository\CategoryRepository;
use COM;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/category")
 */
class CategoryController extends AbstractController
{
    /**
     * @Route("/new", name="create_category", methods={"POST"})
     */
    public function addCategory(Request $request, EntityManagerInterface $entityManager): Response
    {
        $category = new Category();
        $check = $this->getDoctrine()->getRepository(Category::class)
            ->findBy([
                'name' => $request->request->get("name"),
            ]);;
        if ($check) {
            return $this->json(['status' => 'Already exist']);
        } else {
            $category->setName($request->request->get("name"));
            $entityManager->persist($category);
            $entityManager->flush();
            return $this->json(['status' => 'ok']);
        }
    }

    /**
     * @Route("/all", name="category_index", methods={"GET"})
     */
    public function getAll(CategoryRepository $categoryRepository): Response
    {
        $request = $categoryRepository->findAll();
        $result = [];
        for ($i = 0; $i < count($request); $i++) {
            array_push($result, ['id' => $request[$i]->getId(), 'name' => $request[$i]->getName()]);
        }
        return $this->json($result);
    }

    /**
     * @Route("/{id}", name="category_by_id", methods={"GET"})
     */
    public function getCategoryById($id): Response
    {
        $request = $this->getDoctrine()->getRepository(Category::class)
            ->findBy([
                'id' => $id,
            ]);;
        return $this->json(["id" => $request[0]->getId(), "name" => $request[0]->getName()]);
    }

    /**
     * @Route("/{id}/edit", name="category_update", methods={"POST"})
     */
    public function editCategory(Request $request, Category $category, EntityManagerInterface $entityManager): Response
    {
        $name = $request->request->get("name");
        $check = $this->getDoctrine()->getRepository(Category::class)
            ->findBy([
                'name' => $name,
            ]);

        if ($name !== "" && !$check) {
            $category->setName($name);
            $entityManager->persist($category);
            $entityManager->flush();
            return $this->json(['status' => 'ok']);
        } else {
            return $this->json(['status' => 'Already exist']);
        }
    }

    /**
     * @Route("/delete/{id}", name="category_delete", methods={"POST"})
     */
    public function DeleteCategoryById($id, EntityManagerInterface $entityManager): Response
    {
        $category = $this->getDoctrine()->getRepository(Category::class)
            ->findBy([
                'id' => $id,
            ]);;
        $entityManager->remove($category[0]);
        $entityManager->flush();
        return $this->json(["status" => "ok"]);
    }
}
