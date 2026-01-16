"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/__legacy__/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/__legacy__/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/__legacy__/ui/select";
import { Button } from "@/components/atoms/Button/Button";
import { User } from "@supabase/supabase-js";
import * as React from "react";
import { TIMEZONES } from "./helpers";
import { useTimezoneForm } from "./useTimezoneForm";

type Props = {
  user: User;
  currentTimezone?: string;
};

export function TimezoneForm({ user, currentTimezone = "not-set" }: Props) {
  console.log("currentTimezone", currentTimezone);
  // If timezone is not set, try to detect it from the browser
  const effectiveTimezone = React.useMemo(() => {
    if (currentTimezone === "not-set") {
      // Try to get browser timezone as a suggestion
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      } catch {
        return "UTC";
      }
    }
    return currentTimezone;
  }, [currentTimezone]);

  const { form, onSubmit, isLoading } = useTimezoneForm({
    user,
    currentTimezone: effectiveTimezone,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>时区</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>选择您的时区</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择一个时区" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} size="small">
              {isLoading ? "保存中..." : "保存时区"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
