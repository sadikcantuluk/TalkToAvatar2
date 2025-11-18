FactoryBot.define do
  factory :analysis do
    course { nil }
    analysis_type { "MyString" }
    data { "" }
    summary { "MyText" }
  end
end
