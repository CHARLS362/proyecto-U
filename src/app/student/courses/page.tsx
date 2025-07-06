
import { PageTitle } from "@/components/common/PageTitle";
import { mockStudents, mockCourses } from "@/lib/mockData";
import { BookOpenText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudentCoursesPage() {
  // Assuming we are logged in as the first student 'Ana Pérez'
  const student = mockStudents[0];
  const enrolledCourses = student.courses;

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Mis Cursos" 
        subtitle={`Inscrito en ${enrolledCourses.length} cursos este semestre.`} 
        icon={BookOpenText} 
      />
      
      {enrolledCourses.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <BookOpenText className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4">No estás inscrito en ningún curso</CardTitle>
            <CardDescription>Póngase en contacto con la administración para inscribirse en los cursos.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map(enrolledCourse => {
            const courseDetails = mockCourses.find(c => c.id === enrolledCourse.id);
            if (!courseDetails) return null;

            return (
              <Link href={`/student/courses/${courseDetails.id}`} key={courseDetails.id} className="block group">
                <Card className="shadow-lg h-full flex flex-col hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-primary text-xl group-hover:underline">{courseDetails.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 pt-2">
                       <Avatar className="h-6 w-6">
                        <AvatarImage src={courseDetails.instructorAvatar} alt={courseDetails.instructor} data-ai-hint="teacher avatar" />
                        <AvatarFallback>{courseDetails.instructor.substring(0,1)}</AvatarFallback>
                      </Avatar>
                      {courseDetails.instructor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-4">{courseDetails.description}</p>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-muted-foreground">PROGRESO</span>
                            <span className="text-sm font-bold text-primary">{enrolledCourse.progress}%</span>
                        </div>
                        <Progress value={enrolledCourse.progress} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    <span>Ver detalles del curso</span>
                    <ChevronRight className="h-4 w-4 ml-auto transform group-hover:translate-x-1 transition-transform" />
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
