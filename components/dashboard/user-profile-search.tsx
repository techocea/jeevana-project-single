"use client";

import { useState, useEffect } from "react";
import { Check, Loader2, Search } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { getUsersByEmail } from "@/app/actions/profile-actions";

// 1. Unified Interface
interface UserQueryResult {
  id: string;
  email: string;
  fullName?: string;
}

// 2. Inline Debounce Hook
function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const MatrimonialUserSearch = ({
  onSelectUser,
}: {
  onSelectUser: (email: string) => void;
}) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<UserQueryResult[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");

  const debouncedSearchTerm = useDebounce(searchTerm, 350);

  useEffect(() => {
    const fetchRegisteredUsers = async () => {
      if (debouncedSearchTerm.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const result = await getUsersByEmail(debouncedSearchTerm);
        if (result?.data) {
          setSearchResults(result.data);
        }
      } catch (err) {
        console.error("Error searching profiles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredUsers();
  }, [debouncedSearchTerm]);

  return (
    <section className="bg-white border border-muted-foreground/30 rounded-lg p-5 shadow-sm">
      <div className="space-y-2 relative">
        <div>
          <Label className="text-slate-900 font-semibold text-sm">
            Select Registered Account
          </Label>
        </div>

        <div className="w-full relative">
          <Combobox
            items={searchResults}
            value={selectedValue}
            onValueChange={(selectedEmail) => {
              if (!selectedEmail) return;

              const matchedUser = searchResults.find(u => u.email === selectedEmail);
              if (matchedUser) {
                setSelectedValue(matchedUser.email);
                // Dynamically sync React Hook Form value block
                setValue("userId", matchedUser.id, { shouldValidate: true });
                onSelectUser(matchedUser.email);
              }
            }}
          >
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center pointer-events-none text-slate-400 z-10">
                {loading ? (
                  <Loader2 size={16} className="animate-spin text-pink-600" />
                ) : (
                  <Search size={16} />
                )}
              </div>

              <ComboboxInput
                placeholder="Search system users by login email..."
                className="pl-6 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {searchTerm.trim().length >= 2 && (
              <ComboboxContent className="w-full absolute z-20 mt-1.5 bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden">
                {loading && searchResults.length === 0 ? (
                  <div className="p-4 text-xs text-slate-400 text-center flex items-center justify-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin text-pink-600" />
                    Querying database records...
                  </div>
                ) : (
                  <>
                    <ComboboxEmpty className="p-4 text-xs text-slate-400 text-center">
                      No registered emails match these parameters
                    </ComboboxEmpty>

                    <ComboboxList className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                      {(user: UserQueryResult) => (
                        <ComboboxItem
                          key={user.id}
                          value={user.email}
                          className="flex items-center justify-between py-2 px-3 data-[selected=true]:bg-slate-50 cursor-pointer group aria-selected:bg-slate-50"
                        >
                          <div className="flex flex-col min-w-0">
                            <p className="font-medium text-slate-700 group-hover:text-pink-600 transition-colors truncate">
                              {user.email}
                            </p>
                            <span className="text-[10px] font-mono text-slate-400">
                              UID: {user.id}
                            </span>
                          </div>
                          <Check
                            size={14}
                            className={`text-pink-600 transition-opacity ${selectedValue === user.email
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100 group-aria-selected:opacity-100"
                              }`}
                          />
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </>
                )}
              </ComboboxContent>
            )}
          </Combobox>
        </div>

        {errors.userId && (
          <p className="text-xs text-red-500 mt-1">
            {errors.userId.message as string}
          </p>
        )}
      </div>
    </section>
  );
};

export default MatrimonialUserSearch;
