/* eslint-disable consistent-return */
/* eslint-disable no-return-await */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uzupevopaqowfsfifequ.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabaseClient;

export const getSavedDomains = async () => await supabaseClient.from("sirch-domain").select();

export const getSingleDomainByDomainName = async (domain) =>
  await supabaseClient.from("sirch-domain").select().eq("domain_name", domain).single();

export const getSingleDomainByDomainId = async (id) =>
  await supabaseClient.from("sirch-domain").select().eq("id", id).single();

export const addDomain = async (domain) => {
  const { data, error } = await getSingleDomainByDomainName(domain);

  if (error) {
    // no record found then add new record
    return await supabaseClient
      .from("sirch-domain")
      .insert([{ domain_name: domain, count: 1 }])
      .select();
  }

  if (data) {
    // record exists then update
    // return await updateDomain(data.domain_name, data.count);
    return await supabaseClient
      .from("sirch-domain")
      .update([{ domain_name: data.domain_name, count: data.count + 1 }])
      .eq("id", data.id)
      .select();
  }
};

export const updateDomain = async (data) =>
  await supabaseClient
    .from("sirch-domain")
    .update([{ domain_name: data.domain_name, count: data.count + 1 }])
    .eq("id", data.id);

export const getUnderDomainsByDomain = async (domain) => {
  const { data, error } = await supabaseClient.from("under-domains").select().eq("domain", domain).select();

  if (error) {
    // no record found
    return [];
  }

  if (data) {
    return data.map((d) => d["search-text"]) || [];
  }
};
