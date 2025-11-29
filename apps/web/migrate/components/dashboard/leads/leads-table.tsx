import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Lead } from './types';

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === 'captured'
      ? 'bg-blue-100 text-blue-700'
      : status === 'contact'
        ? 'bg-amber-100 text-amber-700'
        : status === 'response'
          ? 'bg-purple-100 text-purple-700'
          : 'bg-emerald-100 text-emerald-700';
  return (
    <Badge className={`${tone} border px-2 py-0.5 capitalize`}>{status}</Badge>
  );
}

export function LeadsTable({
  items,
  onEdit,
  onDelete,
}: {
  items: Lead[];
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
}) {
  return (
    <Table>
      <TableCaption className="text-xs">
        Showing {items.length} lead(s)
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Lead</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((l) => (
          <TableRow key={l.id}>
            <TableCell>{l.fullname}</TableCell>
            <TableCell>{l.company_name}</TableCell>
            <TableCell>{l.email}</TableCell>
            <TableCell>
              <StatusBadge status={l.status} />
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onEdit?.(l)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete?.(l)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
