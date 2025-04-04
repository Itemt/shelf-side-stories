
import { useState, useEffect } from "react";
import { useLibrary } from "@/context/LibraryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Admin = () => {
  const { books, deleteBook, toggleAvailability } = useLibrary();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = sessionStorage.getItem("adminAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("adminDashboard")}</h1>
          <p className="text-muted-foreground">{t("manageLibrary")}</p>
        </div>
        <Button onClick={() => navigate("/books/add")} className="flex gap-2">
          <Plus className="h-4 w-4" />
          {t("addNewBook")}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchBooks")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("bookTitle")}</TableHead>
              <TableHead>{t("bookAuthor")}</TableHead>
              <TableHead>{t("bookGenre")}</TableHead>
              <TableHead>{t("bookISBN")}</TableHead>
              <TableHead>{t("bookStatus")}</TableHead>
              <TableHead className="w-[100px]">{t("edit")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t("noResults")}
                </TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">
                    <a 
                      href={`/books/${book.id}`}
                      className="hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/books/${book.id}`);
                      }}
                    >
                      {book.title}
                    </a>
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>
                    <Badge
                      className={`cursor-pointer ${
                        book.available
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-amber-500 hover:bg-amber-600"
                      }`}
                      onClick={() => toggleAvailability(book.id)}
                    >
                      {book.available ? t("bookAvailable") : t("bookBorrowed")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => navigate(`/books/edit/${book.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("delete")}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {`${t("delete")} "${book.title}"? ${t("noResults")}`}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteBook(book.id)}>
                              {t("delete")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Admin;
