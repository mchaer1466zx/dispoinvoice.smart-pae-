"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { AddCustomerDialog } from "@/components/pelanggan/add-customer-dialog";
import { EditCustomerDialog } from "@/components/pelanggan/edit-customer-dialog";
import { DeleteCustomerDialog } from "@/components/pelanggan/delete-customer-dialog";
import { MOCK_CUSTOMERS, type Customer } from "@/lib/mock-data";

export default function PelangganPage() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(query)
    );
  }, [customers, search]);

  function handleEditSave(updated: Customer) {
    setCustomers((current) =>
      current.map((customer) => (customer.id === updated.id ? updated : customer))
    );
  }

  function handleDelete(customerId: string) {
    setCustomers((current) =>
      current.filter((customer) => customer.id !== customerId)
    );
  }

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="flex w-full max-w-3xl flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Button variant="ghost" size="sm" className="w-fit" asChild>
              <Link href="/">
                <ArrowLeft /> Kembali ke Buat Invoice
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold tracking-tight">
              Manajemen Pelanggan
            </h1>
            <p className="text-sm text-muted-foreground">
              Semua pelanggan yang tersimpan dan dapat dipilih saat membuat invoice.
            </p>
          </div>
          <AddCustomerDialog
            onAdd={(customer) =>
              setCustomers((current) => [...current, customer])
            }
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Pelanggan</CardTitle>
            <CardDescription>
              {filteredCustomers.length} dari {customers.length} pelanggan
              ditampilkan.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <InputGroup>
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Cari nama pelanggan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>

            {customers.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
                <Users className="size-8" />
                <p className="text-sm">Belum ada pelanggan tersimpan.</p>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
                <Search className="size-8" />
                <p className="text-sm">
                  Tidak ada pelanggan yang cocok dengan &quot;{search}&quot;.
                </p>
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <div className="mt-1 flex flex-col gap-0.5 text-sm text-muted-foreground sm:flex-row sm:gap-4">
                      <span className="flex items-center gap-1.5">
                        <Mail className="size-3.5 shrink-0" />
                        {customer.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="size-3.5 shrink-0" />
                        {customer.phone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 shrink-0" />
                        {customer.address}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <EditCustomerDialog
                      customer={customer}
                      onSave={handleEditSave}
                    />
                    <DeleteCustomerDialog
                      customer={customer}
                      onConfirm={handleDelete}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
