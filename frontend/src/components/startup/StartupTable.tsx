"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { StartupAssessmentsT } from "@/types/strapi/Startup";
import { IconLock, IconLockOpen, IconStar } from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

function StartupTable({
  assessments,
  startupId,
}: {
  assessments: StartupAssessmentsT[] | undefined;
  startupId: string;
}) {
  const router = useRouter();
  return (
    <Table>
      {!assessments || assessments.length === 0 ? (
        <TableCaption>
          There hasn’t been an assessment submitted yet.!
        </TableCaption>
      ) : null}
      <TableHeader>
        <TableRow>
          <TableHead>Champion</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead>Locked</TableHead>
          <TableHead>Judge</TableHead>
          <TableHead className="text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assessments?.map((assessment) => (
          <TableRow
            key={assessment.id}
            onClick={() => router.push(`./${startupId}/${assessment.id}`)}
          >
            <TableCell className="font-medium">{assessment.step}</TableCell>
            <TableCell>{formatDate(assessment.createdAt)}</TableCell>
            <TableCell>{formatDate(assessment.updatedAt)}</TableCell>
            <TableCell>
              {assessment.lockedForm ? (
                <IconLock className="text-red-400" />
              ) : (
                <IconLockOpen className="text-green-400" />
              )}
            </TableCell>
            <TableCell>{assessment?.judge?.username}</TableCell>
            <TableCell className="text-right">
              <Badge>
                <IconStar size={14} className="mr-1" /> {assessment.score}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default StartupTable;
