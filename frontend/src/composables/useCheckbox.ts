import { computed, isRef, ref, unref, type MaybeRef, type Ref } from "vue";

const useCheckbox = (
  options: MaybeRef<{ value: string; label: string | number }[]>,
  checkedValues?: MaybeRef<string[]>,
) => {
  const checked = Array.isArray(checkedValues)
    ? isRef(checkedValues)
      ? checkedValues as Ref<string[]>
      : ref(checkedValues)
    : ref([] as string[]);

  const checkAll = computed({
    get() {
      return checked.value.length === unref(options).length;
    },
    set(val) {
      if (val) {
        checked.value = unref(options).map((opt) => opt.value);
      } else {
        checked.value = [];
      }
    },
  });

  const isIndeterminate = computed(() => {
    const _options = unref(options);
    if (!_options.length) return false;
    return checked.value.length > 0 && checked.value.length < _options.length;
  });

  return {
    checked,
    checkAll,
    isIndeterminate
  }
};

export default useCheckbox;
